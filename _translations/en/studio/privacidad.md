---
title: "TopeRC Studio privacy"
---

Updated: October 29, 2026.

This page describes TopeRC Studio's local TikTok integration. Public website practices are described separately in the [website privacy policy](/en/politica-privacidad/).

## Who uses the data

Studio is operated by TopeRC on its owner's computer. Contact for enquiries and requests about this data: [toperc.es@gmail.com](mailto:toperc.es@gmail.com).

## Data used and purposes

When TikTok is connected through its official authorization process, Studio receives account identifiers and access and refresh tokens. It queries the identifier and username to check that the destination account is the intended one.

Requested permissions are `user.info.basic`, `user.info.profile` and `video.upload`. Profile permissions allow profile information to be requested; this integration queries the identifier and username to verify the destination. `video.upload` allows the video to be sent to the TikTok inbox for the creator to review and publish.

Studio uses the selected video file, its integrity fingerprint, scheduled time and delivery status. It keeps the attempt identifier and, if supplied by the owner, the publication link for tracking and duplicate prevention.

## Storage and recipients

Credentials, schedules and attempt records are stored in local files on the computer. They are not deliberately included in the repository or this website. Anyone with access to these files should treat them as confidential.

TikTok receives authentication requests, account and status queries, and the video the owner authorized for transfer. In this mode, Studio does not send the caption or a separate cover: the creator reviews and sets them in TikTok. TikTok's subsequent processing is subject to its [privacy policy](https://www.tiktok.com/legal/page/eea/privacy-policy/en).

Studio does not sell this data or use it for advertising. This integration does not require hosting the video at a public web address or opening a public tunnel.

## Retention, disconnection and deletion

Local files remain until the owner deletes them; no automatic deletion period is implemented for credentials, manifests or attempt records. Removing a task from the list does not remove these records or remote content.

The holder can revoke authorization in TikTok. To remove the local credentials and records as well, they must cancel pending transfers and delete the relevant files on the computer. Publications or videos already received by TikTok are managed in TikTok. Instructions or assistance can be requested through the contact email above.

## Changes

This information will be updated if the integration's operation changes.
