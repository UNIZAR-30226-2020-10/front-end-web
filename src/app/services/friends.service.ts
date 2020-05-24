import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  friends;
  petitions;
  intervalId;
  notifSongs;
  notifLists;
  pend = new Subject<number>();

  constructor() { }

  get() {
    return this.pend;
  }

  set(n) {
    this.pend.next(n);
  }

  addedFriend(user) {
    for(let friend of this.friends) {
      if(user.Email === friend.Email) {
        return true;
      }
    }
    return false;
  }

  addedSong(song) {
    for(let friend of this.notifSongs) {
      if(song.Emisor[0] === friend.Emisor[0] && song.Receptor === friend.Emisor && song.Cancion.ID === friend.Cancion.ID) {
        return true;
      }
    }
    return false;
  }

  addedList(song) {
    for(let friend of this.notifLists) {
      if(song.Emisor[0] === friend.Emisor[0] && song.Receptor === friend.Emisor && song.Listas.ID === friend.Listas.ID) {
        return true;
      }
    }
    return false;
  }

  addedPetition(pet) {
    for(let friend of this.petitions) {
      if(pet.ID === friend.ID) {
        return true;
      }
    }
    return false;
  }

  actualizeSongs(newPet) {
    if(!this.notifSongs) {
      this.notifSongs = newPet;
    } else {
      for(let pet of newPet) {
        if(!this.addedSong(pet)) {
          this.notifSongs.push(pet);
        }
      }
    }
  }

  actualizeLists(newPet) {
    if(!this.notifLists) {
      this.notifLists = newPet;
    } else {
      for(let pet of newPet) {
        if(!this.addedList(pet)) {
          this.notifLists.push(pet);
        }
      }
    }
  }

  actualizePetitions(newPet) {
    if(!this.petitions) {
      this.petitions = newPet;
    } else {
      for(let pet of newPet) {
        if(!this.addedPetition(pet)) {
          this.petitions.push(pet);
        }
      }
    }
  }

}
