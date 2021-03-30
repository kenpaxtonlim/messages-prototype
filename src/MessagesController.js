import { makeAutoObservable } from "mobx";

export default class MessagesController {
  conversation = [];
  autoReply = '';
  autoComplete = '';

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
      this.fetchAutoReply(text);
    } else {
      this.autoReply = '';
    }
  }

  fetchAutoReply = (customerInput) => {
    fetch('http://localhost:9999/post/feedback_bot', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: customerInput,
        mode: 'auto-reply'
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
    fetch('http://localhost:9999/post/feedback_bot', {
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
