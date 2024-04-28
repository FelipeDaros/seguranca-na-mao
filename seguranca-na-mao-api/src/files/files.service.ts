import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
    constructor() {

    }

    public async uploadSingleFile(file: Buffer){}

    public async multipleFile(){}
}
