
import DataConverter from './DataConverter';

export default function JsonToExcel() {
    return <DataConverter initialMode="json-excel" hideTabs={true} />;
}
