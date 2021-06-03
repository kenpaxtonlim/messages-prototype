import { makeAutoObservable } from "mobx";

export default class MessagesController {
  conversation = [];
  autoReply = '';
  autoComplete = '';
  suggestedActions = [];
  modalMode = 'NONE';

  isAutoReply = true;
  isAutoComplete = true;
  isSuggestAction = true;
  isSuggestLink = true;

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

  sendMessage = (text, speaker, metadata) => {
    this.conversation = [ ...this.conversation, {text, speaker, metadata} ];
    if (speaker === 'customer') {
      this.autoReply = '';
      this.fetchAutoReply(text);
    } else {
      this.autoReply = '';
      this.autoComplete = '';
      if (!metadata) {
        this.fetchAutoReply(text, true);
      }
    }
  }

  sendAction = () => {
    switch(this.modalMode) {
      case 'INVOICE':
        this.sendMessage(
          'Square has requested a $100 invoice. View it at https://sq.invoice.com/QK12D10E',
          'merchant',
          {
            event: this.modalMode,
          }
        );
      break;
      case 'PAYMENT':
        this.sendMessage(
          'Square has requested a payment of $100. View it at https://sq.checkout.com/QK12D10E',
          'merchant',
          {
            event: this.modalMode,
          }
        );
        break;
      case 'REFUND':
        this.sendMessage(
          'Square has issued you a refund of $100. View it at https://sq.receipt.com/QK12D10E',
          'merchant',
          {
            event: this.modalMode,
          }
        );
        break;
      case 'APPOINTMENT':
        this.sendMessage(
          'You have booked an appointment with Square on May 20, 2.00pm. View it at https://sq.appointment.com/QK12D10E',
          'merchant',
          {
            event: this.modalMode,
          }
        );
        break;
      default:
    }

    this.modalMode = 'NONE';
  }

  fetchAutoReply = (customerInput, skipAutoReply) => {
    this.suggestedActions = [];
    if (this.isAutoReply && !skipAutoReply) {
      fetch('https://corgi.mysquarephone.com/post/auto_complete_service', {
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
    if (this.isSuggestAction) {
      if (customerInput.search(/\$/g) !== -1) {
        this.suggestedActions.push('Request Payment');
      }
      if (customerInput.toLowerCase().search('invoice') !== -1) {
        this.suggestedActions.push('Send Invoice');
      }
      if (customerInput.toLowerCase().search('refund') !== -1) {
        this.suggestedActions.push('Issue Refund');
      }
      if (customerInput.toLowerCase().search('photo') !== -1) {
        this.suggestedActions.push('Send Photo');
      }
      if (customerInput.toLowerCase().search('appointment') !== -1) {
        this.suggestedActions.push('Send Booking Site');
        this.suggestedActions.push('Create Appointment');
      }
    }
  }

  fetchAutoComplete = (merchantInput) => {
    if (this.isAutoComplete) {
      let previousCustomerUtterance = '';
      if (this.conversation.length > 0) {
        const previousUtterance = this.conversation[this.conversation.length - 1];
        if (previousUtterance.speaker === 'customer') {
          previousCustomerUtterance = previousUtterance.text;
        }
      }
      fetch('https://corgi.mysquarephone.com/post/auto_complete_service', {
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
    if (this.isSuggestAction) {
      this.suggestedActions = [];
      if (merchantInput.search(/\$/g) !== -1) {
        this.suggestedActions.push('Request Payment');
      }
      if (merchantInput.toLowerCase().search('invoice') !== -1) {
        this.suggestedActions.push('Send Invoice');
      }
      if (merchantInput.toLowerCase().search('refund') !== -1) {
        this.suggestedActions.push('Issue Refund');
      }
      if (merchantInput.toLowerCase().search('photo') !== -1) {
        this.suggestedActions.push('Send Photo');
      }
      if (merchantInput.toLowerCase().search('appointment') !== -1) {
        this.suggestedActions.push('Send Booking Site');
        this.suggestedActions.push('Create Appointment');
      }
    }
  }

  clearAutoReply = () => {
    this.autoReply = '';
  }

  clearAutoComplete = () => {
    this.autoComplete = '';
  }

  clearSuggestedActions = () => {
    this.suggestedActions = [];
    this.autoReply = '';
  }

  setModal = (modal) => {
    this.modalMode = modal;
  }
}
