import { observer } from 'mobx-react';
import './LinkCard.scss';

function LinkCard(props) {
  const { name, brand, price, sendLink } = props;

  return (
    <div className="EventCard">
      <div className="EventCard-top">
        <div className="EventCard-icon"></div>
        <div className="EventCard-header">
          <div className="LinkCard-title">{name}</div>
          <div className="EventCard-subtitle">
            {brand}・{price}
          </div>
        </div>
      </div>
      <div className="EventCard-bottom" onClick={() => sendLink()}>
        Send Link
      </div>
    </div>
  );
}

export default observer(LinkCard);
