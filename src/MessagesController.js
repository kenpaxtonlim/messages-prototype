import { makeAutoObservable } from 'mobx';

export default class MessagesController {
  conversation = [];
  autoReply = '';
  autoComplete = '';
  suggestedActions = [];
  suggestedLinks = [];
  mostRecentAction = 'NONE';
  modalMode = 'NONE';
  isSettingsOpen = false;

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
    this.conversation = [...this.conversation, { text, speaker, metadata }];
    if (metadata?.event) {
      this.mostRecentAction = metadata.event;
    }
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
  };

  sendAction = () => {
    switch (this.modalMode) {
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
          'You have booked an appointment with Square on May 20, 2.00pm. View it at https://sq.appt.com/QK12D10E',
          'merchant',
          {
            event: this.modalMode,
          }
        );
        break;
      case 'COUPON':
        this.sendMessage(
          'Square sent you a coupon for $10 off. Use code: 123 456 https://sq.rewards.com/QK12D10E',
          'merchant',
          {
            event: this.modalMode,
          }
        );
        break;
      default:
    }

    this.modalMode = 'NONE';
  };

  sendLink = (link) => {
    this.sendMessage(
      `${link.name} for ${link.price}. Purchase at https://sq.checkout.com/QK12D10E`,
      'merchant',
      {
        event: 'LINK',
        link,
      }
    );
    this.suggestedLinks = [];
  };

  fetchAutoReply = (customerInput, skipAutoReply) => {
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
        .then((resp) => resp.json())
        .then((data) => {
          const predictions = data.result.prediction;
          if (predictions && predictions.length > 0) {
            this.autoReply = predictions[0];
          }
        });
    }
    if (this.isSuggestAction) {
      this.getSuggestedActions(customerInput);
    }
    if (this.setIsSuggestLink) {
      this.getSuggestedLinks(customerInput);
    }
  };

  fetchAutoComplete = (merchantInput) => {
    if (this.isAutoComplete) {
      let previousCustomerUtterance = '';
      if (this.conversation.length > 0) {
        const previousUtterance =
          this.conversation[this.conversation.length - 1];
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
        .then((resp) => resp.json())
        .then((data) => {
          const predictions = data.result.prediction;
          if (predictions && predictions.length > 0) {
            this.autoComplete = predictions[0];
          }
        });
    }
    if (this.isSuggestAction) {
      this.getSuggestedActions(merchantInput);
    }
    if (this.setIsSuggestLink) {
      this.getSuggestedLinks(merchantInput);
    }
  };

  getSuggestedActions = (input) => {
    this.suggestedActions = [];
    const inputLowercase = input.toLowerCase();
    if (
      (inputLowercase.search(/\$/g) !== -1 ||
        inputLowercase.search('payment') !== -1) &&
      this.mostRecentAction !== 'PAYMENT'
    ) {
      this.suggestedActions.push('Request Payment');
    }
    if (
      inputLowercase.search('invoice') !== -1 &&
      this.mostRecentAction !== 'INVOICE'
    ) {
      this.suggestedActions.push('Send Invoice');
    }
    if (
      inputLowercase.search('refund') !== -1 &&
      this.mostRecentAction !== 'REFUND'
    ) {
      this.suggestedActions.push('Issue Refund');
      this.suggestedActions.push('Send Coupon');
    }
    if (
      inputLowercase.search('photo') !== -1 &&
      this.mostRecentAction !== 'PHOTO'
    ) {
      this.suggestedActions.push('Send Photo');
    }
    if (
      inputLowercase.search('appointment') !== -1 &&
      this.mostRecentAction !== 'APPOINTMENT'
    ) {
      this.suggestedActions.push('Send Booking Site');
      this.suggestedActions.push('Create Appointment');
    }
    if (
      inputLowercase.search('coupon') !== -1 &&
      this.mostRecentAction !== 'COUPON'
    ) {
      this.suggestedActions.push('Send Coupon');
    }
  };

  getSuggestedLinks = (input) => {
    this.suggestedLinks = [];
    const inputLowercase = input.toLowerCase();
    if (inputLowercase.search('hair') !== -1) {
      this.suggestedLinks.push({
        name: 'Hydrating Shampoo',
        brand: 'Herbal Essences',
        price: '$27.00',
      });
      this.suggestedLinks.push({
        name: 'Hydrating Conditioner',
        brand: 'Revlon',
        price: '$25.00',
      });
      this.suggestedLinks.push({
        name: 'Curl Cream',
        brand: 'Tresime',
        price: '$19.00',
      });
    }
  };

  clearAutoReply = () => {
    this.autoReply = '';
  };

  clearAutoComplete = () => {
    this.autoComplete = '';
  };

  clearSuggestedActions = () => {
    this.suggestedActions = [];
    this.autoReply = '';
  };

  setModal = (modal) => {
    this.modalMode = modal;
  };

  openSettings = () => {
    this.isSettingsOpen = true;
  };

  closeSettings = () => {
    this.isSettingsOpen = false;
  };

  setIsAutoReply(isAutoReply) {
    this.isAutoReply = isAutoReply;
  }

  setIsAutoComplete(isAutoComplete) {
    this.isAutoComplete = isAutoComplete;
  }

  setIsSuggestAction(isSuggestAction) {
    this.isSuggestAction = isSuggestAction;
  }

  setIsSuggestLink(isSuggestLink) {
    this.isSuggestLink = isSuggestLink;
  }
}
