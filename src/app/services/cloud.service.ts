import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudService {
  files: any = [
    // tslint:disable-next-line: max-line-length
    {
      url:
        'https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3',
      name: 'Perfect',
      artist: ' Ed Sheeran'
    },
    {
      // tslint:disable-next-line: max-line-length
      url:
        'https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3',
      name: 'Man Atkeya Beparwah',
      artist: 'Nusrat Fateh Ali Khan'
    },
    {
      url:
        'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Circus_Marcus/Circus_Marcus_-_Singles/Circus_Marcus_-_01_-_Eden_Kaput.mp3',
      name: 'Penny Lane',
      artist: 'The Beatles'
    }
  ];

  getFiles() {
    return of(this.files);
  }
}
