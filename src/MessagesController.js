import { makeAutoObservable } from "mobx";

export default class MessagesController {
  conversation = [];
  autoReply = '';
  autoComplete = '';

  constructor() {
    this.conversation = [
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        speaker: 'merchant',
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        speaker: 'customer',
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        speaker: 'merchant',
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        speaker: 'customer',
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        speaker: 'merchant',
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        speaker: 'customer',
      },
      {
        text: 'Hello',
        speaker: 'merchant',
      },
      {
        text: 'Hey there',
        speaker: 'customer',
      },
    ];

    makeAutoObservable(this);
  }

  sendMessage = (text, speaker) => {
    this.conversation = [ ...this.conversation, {text, speaker} ];
    if (speaker === 'customer') {
      this.fetchAutoReply(text);
    } else {
      this.autoReply = '';
    }
  }

  fetchAutoReply = (customerInput) => {
    fetch('http://3.142.194.41:80/post/auto_complete_service', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: customerInput,
        mode: 'auto-reply',
      }),
    })
    .then(resp => resp.json())
    .then(data => {
      const predictions = data.result.prediction;
      if (predictions && predictions.length > 0) {
        this.autoReply = predictions[0];
      }
    });
  }

  fetchAutoComplete = (merchantInput) => {
    let previousCustomerUtterance = '';
    if (this.conversation.length > 0) {
      const previousUtterance = this.conversation[this.conversation.length - 1];
      if (previousUtterance.speaker === 'customer') {
        previousCustomerUtterance = previousUtterance.text;
      }
    }
    fetch('http://3.142.194.41:80/post/auto_complete_service', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: previousCustomerUtterance,
        merchant_input: merchantInput,
        mode: 'auto-complete',
        auto_complete_length: 5,
        use_trie: true,
      }),
    })
    .then(resp => resp.json())
    .then(data => {
      const predictions = data.result.prediction;
      if (predictions && predictions.length > 0) {
        this.autoComplete = predictions[0];
      }
    });
  }
}
