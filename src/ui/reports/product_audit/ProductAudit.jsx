import React, {Component} from 'react';
import ProductAuditStore from './ProductAuditStore';
import GoBackTitle from '../../components/GoBackTitle';
import PoSActions from "../../PoSActions";
import PAuditForm from "./PAuditForm";
import PAuditResume from "./PAuditResume";
import PAuditOperations from "./PAuditOperations";
import PAuditModal from "./PAuditModal";

class ProductAudit extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = ProductAuditStore.getState();
  }

  componentDidMount() {
    document.title = 'Auditar producto';
  }

  componentWillMount() {
    ProductAuditStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    ProductAuditStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(ProductAuditStore.getState());
  }

  static onProductAutocompleteValueChange(e, { newValue }) {
    PoSActions.reports.pAudit.onProductAutoCompleteValueChange(newValue);
  }

  static onProductSelected(e, { suggestion }) {
    PoSActions.reports.pAudit.onProductSelected(suggestion);
  }

  static onStartDateChange(aMoment) {
    PoSActions.reports.pAudit.onStartDateChange(aMoment.toDate());
  }

  static onEndDateChange(aMoment) {
    PoSActions.reports.pAudit.onEndDateChange(aMoment.toDate());
  }

  static onOperationsTypeChange(e) {
    PoSActions.reports.pAudit.onOperationsTypeChange(e.target.value);
  }

  static onGenerateReportClicked() {
    PoSActions.reports.pAudit.onGenerateReportClicked();
  }

  static onViewDetailsClicked(operationType, operationId) {
    PoSActions.reports.pAudit.onViewDetailsClicked(operationType, operationId)
  }

  static onModalCloseClicked() {
    PoSActions.reports.pAudit.onDetailsModalCloseClicked()
  }

  render() {
    return (
      <div className="container">
        <GoBackTitle title="Auditar producto" history={ this.props.history }/>
        <br/>

        <PAuditForm
          productAutocompleteValue={ this.state.form.product.autocompleteValue }
          onProductAutocompleteValueChange={ ProductAudit.onProductAutocompleteValueChange }
          onProductSelected={ ProductAudit.onProductSelected }
          productError={ this.state.form.product.error }

          startDate={ this.state.form.startDate }
          onStartDateChange={ ProductAudit.onStartDateChange }

          endDate={ this.state.form.endDate }
          onEndDateChange={ ProductAudit.onEndDateChange }

          operationsType={ this.state.form.operationsType }
          onOperationsTypeChange={ ProductAudit.onOperationsTypeChange }

          onGenerateReportClicked={ ProductAudit.onGenerateReportClicked }
        />

        <PAuditResume
          purchasesTotal={ this.state.purchasesTotal }
          salesTotal={ this.state.salesTotal}
          gain={ this.state.gain }
        />
        
        <PAuditOperations
          operations={ this.state.operations }
          onViewDetailsClicked={ ProductAudit.onViewDetailsClicked }
        />

        <PAuditModal
          show={ this.state.showingModal }
          onClose={ ProductAudit.onModalCloseClicked }
          operationType={ this.state.modalOperationType }
          operationId={ this.state.modalOperationId}
        />
      </div>
    );
  }
}

export default ProductAudit;
