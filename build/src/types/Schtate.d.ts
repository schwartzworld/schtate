import { Reduceable } from "./Reducable";
import { Mappable } from "./Mappable";
export declare type Schtate<T> = Mappable<T> & Reduceable<T>;
