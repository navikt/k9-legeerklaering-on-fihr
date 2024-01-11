import ChildrenProp from "@/utils/ChildrenProp";

const CenterColumn = ({children}: ChildrenProp) => {
    return <div className="mx-auto max-w-4xl p-4 pb-32">{children}</div>
}

export default CenterColumn;