import React from 'react';
import RefuelContainer from 'containers/RefuelContainer';
import RefuelToolbar from 'components/RefuelToolbar';
import RefuelHistoryTable from 'components/RefuelHistoryTable';

class MainView extends React.Component {
    render() {
        return (
            <React.Fragment>
                <RefuelToolbar />
                <RefuelHistoryTable />
            </React.Fragment>
        );
    }
}

export default MainView;