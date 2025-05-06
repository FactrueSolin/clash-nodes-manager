import { ClashConfigSchema } from "../api/[[...route]]/types";

export const exampleConfig: ClashConfigSchema = {
  port: 7890,
  socksport: 7891,
  "allow-lan": true,
  mode: 'Rule',
  "log-level": 'info',
  "external-controller": ':9090',
  dns: {
    enable: true,
    nameserver: [
      '119.29.29.29',
      '223.5.5.5'
    ],
    fallback: [
      '8.8.8.8',
      '8.8.4.4',
      'tls://1.0.0.1:853',
      'tls://dns.google:853'
    ]
  }
};