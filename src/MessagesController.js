import { makeAutoObservable } from "mobx";

export default class MessagesController {
  conversation = [];
  suggestion = "";

  constructor() {
    this.conversation = [
      {
        text: 'Hello',
        speaker: 'merchant',
      },
      {
        text: 'How are you?',
        speaker: 'customer',
      }
    ];

    makeAutoObservable(this);
  }

  sendMessage = (text, speaker) => {
    this.conversation = [ ...this.conversation, {text, speaker} ];
    if (speaker === 'customer') {
      this.suggestion = "I'm sorry to hear that. Please accept this coupon.";
    } else {
      this.suggestion = '';
    }
  }

  clearSuggestion = () => {
    this.suggestion = '';
  }
}
