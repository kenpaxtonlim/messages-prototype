import { observer } from "mobx-react";
import CustomerPane from './CustomerPane/CustomerPane';
import MessagesPane from './MessagesPane/MessagesPane';
import './App.scss';

function App(props) {
  const { controller } = props;

  return (
    <div className="App">
      <CustomerPane conversation={controller.conversation} sendMessage={controller.sendMessage} />
      <MessagesPane conversation={controller.conversation} sendMessage={controller.sendMessage} suggestion={controller.suggestion} />
    </div>
  );
}

export default observer(App);
