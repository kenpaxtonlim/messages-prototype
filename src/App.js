import { observer } from 'mobx-react';
import CustomerPane from './CustomerPane/CustomerPane';
import MessagesPane from './MessagesPane/MessagesPane';
import Modal from './Modal/Modal';
import './App.scss';
import SettingsSheet from './SettingsSheet/SettingsSheet';

function App(props) {
  const { controller } = props;

  return (
    <div className="App">
      <CustomerPane controller={controller} />
      <MessagesPane controller={controller} />
      {controller.modalMode !== 'NONE' ? (
        <Modal
          mode={controller.modalMode}
          send={controller.sendAction}
          close={() => (controller.modalMode = 'NONE')}
        />
      ) : null}
      {controller.isSettingsOpen ? (
        <SettingsSheet controller={controller} />
      ) : null}
    </div>
  );
}

export default observer(App);
