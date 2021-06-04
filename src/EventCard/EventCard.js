import { observer } from 'mobx-react';
import AppointmentIcon from '../svg/AppointmentIcon';
import CouponIcon from '../svg/CouponIcon';
import InvoiceIcon from '../svg/InvoiceIcon';
import PaymentIcon from '../svg/PaymentIcon';
import RefundIcon from '../svg/RefundIcon';
import './EventCard.scss';

function EventCard(props) {
  const { event } = props;

  let title = 'New invoice';
  let button = 'View invoice';
  let icon = null;

  switch (event) {
    case 'INVOICE':
      title = 'New invoice';
      button = 'View invoice';
      icon = <InvoiceIcon />;
      break;
    case 'PAYMENT':
      title = 'Payment request';
      button = 'View payment link';
      icon = <PaymentIcon />;
      break;
    case 'REFUND':
      title = 'Refund issued';
      button = 'View receipt';
      icon = <RefundIcon />;
      break;
    case 'APPOINTMENT':
      title = 'New appointment';
      button = 'View appointment';
      icon = <AppointmentIcon />;
      break;
    case 'COUPON':
      title = '$10 off your next purchase';
      button = 'View coupon';
      icon = <CouponIcon />;
      break;
    default:
  }

  if (event === 'PHOTO') {
    return (
      <div className="EventCard-photos">
        <div className="EventCard-photo EventCard-photo-1" />
        <div className="EventCard-photo EventCard-photo-2" />
        <div className="EventCard-photo EventCard-photo-3" />
      </div>
    );
  } else {
    return (
      <div className="EventCard">
        <div className="EventCard-top">
          <div className="EventCard-icon">{icon}</div>
          <div className="EventCard-header">
            <div className="EventCard-title">{title}</div>
            <div className="EventCard-subtitle">XXXXXXXXXXX</div>
          </div>
        </div>
        <div className="EventCard-bottom">{button}</div>
      </div>
    );
  }
}

export default observer(EventCard);
