import ChildrenProp from "@/utils/ChildrenProp";

import css from './CenterColumn.module.css';

const CenterColumn = ({children}: ChildrenProp) => {
    const cssClass = `mx-auto ${css.centercolumn} p-4 pb-32`
    return <div className={cssClass}>{children}</div>
}

export default CenterColumn;