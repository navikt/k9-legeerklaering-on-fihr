
export const dipsDepartmentReferencePrefix = "Organization/afa"

export type DipsDepartmentReference = `${typeof dipsDepartmentReferencePrefix}${string}`;

export const isDipsDepartmentReference = (str: string): str is DipsDepartmentReference => str.startsWith(dipsDepartmentReferencePrefix)
