import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

type ClashConfig = {
  port: number;
  'socks-port': number;
  'allow-lan': boolean;
  mode: string;
  'log-level': string;
  'external-controller': string;
  dns: {
    enable: boolean;
    nameserver: string[];
    fallback: string[];
  };
};

export function loadConfig(filePath: string = path.join(__dirname, '../../public/example.yaml')): ClashConfig {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const config = yaml.load(fileContents) as ClashConfig;
    return config;
  } catch (e) {
    console.error('Error loading YAML config file:', e);
    throw new Error('Failed to load config file');
  }
}