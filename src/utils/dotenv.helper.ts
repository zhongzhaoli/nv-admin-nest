import * as fs from 'fs';
import * as dotenv from 'dotenv';

// 读取env文件
const getEnv = (name: string): Record<string, unknown> => {
  if (fs.existsSync(name)) {
    return dotenv.parse(fs.readFileSync(name));
  }
  return {};
};

// 返回当前环境变量下的env文件
export const getEnvConfig = (merge = true): Record<string, unknown> => {
  const status = process.env.NODE_ENV || 'development';
  const defaultEnv = getEnv(`.env`);
  const env = getEnv(`.env.${status}`);
  return { ...(merge ? defaultEnv : {}), ...env };
};
