import React from 'react';
import LampWidget from '../Widgets/LampWidget';
import SocketWidget from '../Widgets/SocketWidget';
import WetWidget from '../Widgets/WetWidget';
import MovingWidget from '../Widgets/MovingWidget';
import WattmetrWidget from '../Widgets/WattmetrWidget';
import BatteryWidget from '../Widgets/BatteryWidget';
import LockWidget from '../Widgets/LockWidget';
import styles from './WidgetsGrid.module.css';

const WidgetsGrid = ({ widgets, onRemove }) => {
  const renderWidget = (widget) => {
    const commonProps = {
      key: widget.id,
      id: widget.id,
      name: widget.name,
      onRemove: () => onRemove(widget.id),
      data: widget
    };

    switch (widget.type) {
      case 'lamp':
        return <LampWidget {...commonProps} initialBrightness={widget.settings?.brightness} initialWarmth={widget.settings?.warmth} />;
      case 'socket':
        return <SocketWidget {...commonProps} />;
      case 'humidity':
        return <WetWidget {...commonProps} />;
      case 'motion':
        return <MovingWidget {...commonProps} showLastMotion={widget.settings?.showLastMotion} />;
      case 'power':
        return <WattmetrWidget {...commonProps} />;
      case 'battery':
        return <BatteryWidget {...commonProps} capacity={widget.settings?.capacity} />;
      case 'lock':
        return <LockWidget {...commonProps} pin={widget.settings?.pin} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.widgetsGrid}>
      {widgets.map(renderWidget)}
    </div>
  );
};

export default WidgetsGrid;