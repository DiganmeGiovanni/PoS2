import React, {Component} from 'react';
import GoBackTitle from "../../components/GoBackTitle";
import EarningsForm from "./EarningsForm";
import EarningsReportStore from "./EarningsReportStore";
import PoSActions from "../../PoSActions";
import EarningsDetails from "./EarningsDetails";

class EarningsReport extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = EarningsReportStore.getState();
  }

  componentDidMount() {
    document.title = "Reporte de ganancias";
  }

  componentWillMount() {
    EarningsReportStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    EarningsReportStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(EarningsReportStore.getState());
  }

  static onStartDateChange(aMoment) {
    PoSActions.reports
      .earnings
      .onStartDateChange(aMoment.toDate());
  }

  static onEndDateChange(aMoment) {
    PoSActions.reports
      .earnings
      .onEndDateChange(aMoment.toDate());
  }

  static onGenerateReportClicked() {
    PoSActions.reports.earnings.onGenerateReportClicked();
  }

  render() {
    return (
      <div className="container">
        <GoBackTitle title="Reporte de ganancias" history={ this.props.history }/>
        <br/>

        <EarningsForm
          startDate={ this.state.startDate }
          onStartDateChange={ EarningsReport.onStartDateChange }
          endDate={ this.state.endDate }
          onEndDateChange={ EarningsReport.onEndDateChange }
          onGenerateReportClicked={ EarningsReport.onGenerateReportClicked }
        />

        <EarningsDetails
          totalSold={ this.state.totalSold }
          totalEarnings={ this.state.totalEarnings }
          totalSelfConsumption={ this.state.totalSelfConsumption }
          details={ this.state.details }
        />
      </div>
    );
  }
}

export default EarningsReport;