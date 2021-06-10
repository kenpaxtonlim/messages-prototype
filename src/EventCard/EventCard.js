import { observer } from 'mobx-react';
import AppointmentIcon from '../svg/AppointmentIcon';
import CouponIcon from '../svg/CouponIcon';
import InvoiceIcon from '../svg/InvoiceIcon';
import PaymentIcon from '../svg/PaymentIcon';
import RefundIcon from '../svg/RefundIcon';
import './EventCard.scss';

function EventCard(props) {
  const { metadata } = props;
  const { event, link } = metadata;

  let title = '';
  let subtitle = '';
  let button = '';
  let icon = null;

  switch (event) {
    case 'INVOICE':
      title = 'New invoice';
      subtitle = '$100.00・#000025';
      button = 'View invoice';
      icon = <InvoiceIcon />;
      break;
    case 'PAYMENT':
      title = 'Payment request';
      subtitle = '$100.00';
      button = 'View payment link';
      icon = <PaymentIcon />;
      break;
    case 'REFUND':
      title = 'Refund issued';
      subtitle = '$100.00';
      button = 'View receipt';
      icon = <RefundIcon />;
      break;
    case 'APPOINTMENT':
      title = 'New appointment';
      subtitle = 'Sep 27, 5.00pm・John Doe';
      button = 'View appointment';
      icon = <AppointmentIcon />;
      break;
    case 'COUPON':
      title = '$10 off your next purchase';
      subtitle = 'Expires Sep 20, 2021';
      button = 'View coupon';
      icon = <CouponIcon />;
      break;
    case 'LINK':
      title = link.name;
      subtitle = link.brand + '・' + link.price;
      button = 'View link';
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
            <div className="EventCard-subtitle">{subtitle}</div>
          </div>
        </div>
        <div className="EventCard-bottom">{button}</div>
      </div>
    );
  }
}

export default observer(EventCard);
