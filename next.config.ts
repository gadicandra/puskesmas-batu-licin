import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Container Docker memakai direktori build sendiri (`NEXT_DIST_DIR=.next-docker`
  // di docker-compose.yml). Tanpa pemisahan ini, build di komputer dan build di
  // dalam container memperebutkan folder `.next` yang sama: container menulis
  // sebagai root lewat bind mount, lalu `pnpm build` di komputer gagal dengan
  // `EACCES: permission denied` yang penyebabnya sama sekali tidak jelas.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default withPayload(nextConfig);
