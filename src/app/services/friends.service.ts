import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  friends;
  petitions;
  intervalId;
  notifSongs;
  notifLists;
  pend = 0;

  constructor() { }

  addedFriend(user) {
    for(let friend of this.friends) {
      if(user.Email === friend.Email) {
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
