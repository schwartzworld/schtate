import { Reduceable } from "./Reducable";
import { Mappable } from "./Mappable";

export type Schtate<T> = Mappable<T> & Reduceable<T>;
