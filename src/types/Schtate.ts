import { Reduceable } from "./Reducable.js";
import { Mappable } from "./Mappable.js";

export type Schtate<T> = Mappable<T> & Reduceable<T>;
