import Hooker from './hooker';

let flvInfo;
Hooker.hookParseData(that => flvInfo = that.flvInfo);

export { flvInfo };
