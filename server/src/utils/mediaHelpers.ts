import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const exec = promisify(execCb);

export async function videoToGif(videoPath: string, gifPath: string, fps = 10, width = 480) {
  // requires ffmpeg
  const cmd = `ffmpeg -i "${videoPath}" -vf "fps=${fps},scale=${width}:-1:flags=lanczos" "${gifPath}"`;
  await exec(cmd);
}

export async function audioConvert(inputPath: string, outputPath: string, format: string, bitrate = '192k') {
  // requires ffmpeg
  const cmd = `ffmpeg -i "${inputPath}" -b:a ${bitrate} -f ${format} "${outputPath}"`;
  await exec(cmd);
}

export async function videoConvert(inputPath: string, outputPath: string, format: string, bitrate = '1000k') {
  // requires ffmpeg
  const cmd = `ffmpeg -i "${inputPath}" -b:v ${bitrate} -f ${format} "${outputPath}"`;
  await exec(cmd);
}

export async function createGif(imagePaths: string[], gifPath: string, delay = 100) {
  // requires imagemagick (convert)
  const cmd = `convert -delay ${delay} -loop 0 ${imagePaths.map(p => `"${p}"`).join(' ')} "${gifPath}"`;
  await exec(cmd);
}

export async function hasBinary(name: string) {
  try {
    const cmd = process.platform === 'win32' ? `where ${name}` : `which ${name}`;
    await exec(cmd);
    return true;
  } catch (_err) {
    return false;
  }
}
