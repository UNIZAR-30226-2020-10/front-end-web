import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  friends;
  petitions;
  intervalId;

  constructor() { }

  addedFriend(user) {
    for(let friend of this.friends) {
      if(user.Email === friend.Email) {
        return true;
      }
    }
    return false;
  }

}
