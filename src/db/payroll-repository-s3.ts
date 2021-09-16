import chokidar from 'chokidar';
import PayrollFileRepo from "./payroll-repository-file";
import AWS, { S3 } from 'aws-sdk';
import fse from 'fs-extra';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

const s3Sync = (s3: S3, localDBFilePath: string, key: string, bucket: string) => {

  console.log(`sync to s3: ${localDBFilePath} -> ${bucket}/${key}`);
  s3.upload({
    Bucket: bucket,
    Body: fse.createReadStream(localDBFilePath),
    Key: key,
  }, (err) => {
    if(err) {
      console.log(err);
    }
  });
}
emitter.on('s3-upload', s3Sync)

/**
 * Note: sync sqlite file to s3
 */
export default class PayrollS3Repo extends PayrollFileRepo {
  private s3 = new S3({ region: 'ap-southeast-1'});

  constructor(bucket: string) {
    super();
    console.log(`download from s3: ${bucket}/${this.dbFilename}`);

    this.s3.getObject({
      Bucket: bucket,
      Key: this.dbFilename,
    }, (err, data) => {
      if(!err) {
        fse.createWriteStream(this.dbFile).write(data.Body);
      } else {
        console.log(`[ERROR] download from s3 ${err}`)
      }
    }).promise().catch((err) => {
      console.log(`[ERROR] download from s3 ${err}`)
    });

    chokidar.watch(this.dbFile).on('change', (dbFile) => {
      emitter.emit('s3-upload', this.s3, dbFile, this.dbFilename, bucket)
    }).on('error', (err) => {
      console.log(`error ${err}`);
    });
  }
}