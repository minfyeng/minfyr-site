# ─── GitHub Actions OIDC deploy role (scoped to THIS repo only) ─────────
# Reuses the account's existing GitHub OIDC provider. The trust policy's
# `sub` condition restricts assumption to minfyeng/minfyr-site — no other
# repo in the org can assume this role.

data "aws_caller_identity" "current" {}

locals {
  github_repo = "minfyeng/minfyr-site"
  oidc_arn    = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
}

data "aws_iam_policy_document" "deploy_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"
    principals {
      type        = "Federated"
      identifiers = [local.oidc_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.github_repo}:*"]
    }
  }
}

resource "aws_iam_role" "deploy" {
  name               = "${var.project}-${var.env}-deploy"
  assume_role_policy = data.aws_iam_policy_document.deploy_trust.json
  tags               = local.tags
}

data "aws_iam_policy_document" "deploy_perms" {
  # Sync the site bundle to the bucket
  statement {
    sid    = "S3Sync"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = [
      aws_s3_bucket.site.arn,
      "${aws_s3_bucket.site.arn}/*",
    ]
  }

  # Invalidate the CloudFront cache after a deploy
  statement {
    sid       = "CloudFrontInvalidate"
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.site.arn]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "${var.project}-${var.env}-deploy"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy_perms.json
}
