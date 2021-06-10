import { observer } from 'mobx-react';
import './SettingsSheet.scss';

function SettingsSheet(props) {
  const { controller } = props;

  return (
    <div className="SettingsSheet">
      <div className="SettingsSheet-header">
        <div
          className="SettingsSheet-x"
          onClick={() => controller.closeSettings()}
        >
          ✕
        </div>
        <div className="SettingsSheet-title">Settings</div>
        <div />
      </div>
      <div className="SettingsSheet-body">
        <div>
          <input
            type="checkbox"
            id="reply"
            checked={controller.isAutoReply}
            onChange={(e) => controller.setIsAutoReply(e.target.checked)}
          />
          <label for="reply">Suggested Reply</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="complete"
            checked={controller.isAutoComplete}
            onChange={(e) => controller.setIsAutoComplete(e.target.checked)}
          />
          <label for="complete">Input Autocomplete</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="action"
            checked={controller.isSuggestAction}
            onChange={(e) => controller.setIsSuggestAction(e.target.checked)}
          />
          <label for="action">Suggested Action</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="link"
            checked={controller.isSuggestLink}
            onChange={(e) => controller.setIsSuggestLink(e.target.checked)}
          />
          <label for="link">Suggested Link</label>
        </div>
      </div>
    </div>
  );
}

export default observer(SettingsSheet);
