import { observer } from "mobx-react";
import CustomerPane from './CustomerPane/CustomerPane';
import MessagesPane from './MessagesPane/MessagesPane';
import Modal from './Modal/Modal';
import './App.scss';

function App(props) {
  const { controller } = props;

  return (
    <div className="App">
      <CustomerPane conversation={controller.conversation} sendMessage={controller.sendMessage} />
      <MessagesPane
        conversation={controller.conversation}
        sendMessage={controller.sendMessage}
        autoReply={controller.autoReply}
        autoComplete={controller.autoComplete}
        fetchAutoComplete={controller.fetchAutoComplete}
        clearAutoComplete={controller.clearAutoComplete}
        suggestedActions={controller.suggestedActions}
        clearSuggestedActions={controller.clearSuggestedActions}
        setModal={controller.setModal}
      />
      {controller.modalMode !== 'NONE' ?
        <Modal mode={controller.modalMode} send={controller.sendAction} close={() => controller.modalMode = 'NONE'} />
      : null}
    </div>
  );
}

export default observer(App);
