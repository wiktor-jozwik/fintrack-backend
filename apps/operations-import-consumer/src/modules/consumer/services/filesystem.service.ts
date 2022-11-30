import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesystemService {
  deleteFile(path: string): void {
    fs.unlinkSync(path);
  }
}
