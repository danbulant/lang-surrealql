import {baseParser} from "./dist/index.js"
// console.log(baseParser.parse('select field from type::table($var) where $var > 1 and field2 @@ field1 timeout 10s').toString())
// console.log(baseParser.parse('select * from documents where contents @@ "test"').toString())
console.log(baseParser.parse('select * from documents').toString())