import { observer } from "mobx-react";
import './Modal.scss';

function Modal(props) {
  const { mode, send, close } = props;

  let title = '';
  switch(mode) {
    case 'INVOICE':
      title = 'Send Invoice';
      break;
    case 'PAYMENT':
      title = 'Send Checkout Link';
      break;
    case 'REFUND':
      title = 'Issue Refund';
      break;
    case 'APPOINTMENT':
      title = 'Create Appointment';
      break;
    case 'COUPON':
      title = 'Send Coupon';
      break;
      default:
  }

  return (
    <div className="Modal">
      <div className="Modal-container">
        <div className="Modal-title">
        <div
            className="Modal-button"
            onClick={close}
          >
            ✕
          </div>
          <div
            className="Modal-button"
            onClick={send}
          >
            Send
          </div>
        </div>
        <div className="Modal-body">
          <div className="Modal-title">{title}</div>
          <div className="Modal-placeholder" />
          <div className="Modal-placeholder" style={{width: '90%'}} />
          <div className="Modal-placeholder" style={{width: '90%'}} />
          <div className="Modal-placeholder" style={{width: '80%'}} />
          <div className="Modal-placeholder" style={{width: '80%'}} />
          <div className="Modal-placeholder" style={{width: '50%'}} />
        </div>
      </div>
    </div>
  )
}

export default observer(Modal);
