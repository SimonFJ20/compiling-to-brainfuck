"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const nearley_1 = require("nearley");
const grammar_1 = __importDefault(require("./grammar"));
const getFileContent = async () => {
    if (process.argv.length < 3)
        throw new Error('not enough args');
    const filename = process.argv[2];
    return (await (0, promises_1.readFile)(filename)).toString();
};
const main = async () => {
    const text = await getFileContent();
    const parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(grammar_1.default));
    parser.feed(text);
    const ast = parser.results[0];
    await (0, promises_1.writeFile)('ast.json', JSON.stringify(ast, null, 4));
};
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwQ0FBa0Q7QUFDbEQscUNBQTBDO0FBQzFDLHdEQUF3QztBQUV4QyxNQUFNLGNBQWMsR0FBRyxLQUFLLElBQUksRUFBRTtJQUM5QixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFDL0QsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxPQUFPLENBQUMsTUFBTSxJQUFBLG1CQUFRLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNqRCxDQUFDLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtJQUNwQixNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxpQkFBZSxDQUFDLENBQUMsQ0FBQztJQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsTUFBTSxJQUFBLG9CQUFTLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUMsQ0FBQTtBQUVELElBQUksRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVhZEZpbGUsIHdyaXRlRmlsZSB9IGZyb20gXCJmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHsgR3JhbW1hciwgUGFyc2VyIH0gZnJvbSBcIm5lYXJsZXlcIjtcbmltcG9ydCBDb21waWxlZEdyYW1tYXIgZnJvbSBcIi4vZ3JhbW1hclwiO1xuXG5jb25zdCBnZXRGaWxlQ29udGVudCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5hcmd2Lmxlbmd0aCA8IDMpIHRocm93IG5ldyBFcnJvcignbm90IGVub3VnaCBhcmdzJylcbiAgICBjb25zdCBmaWxlbmFtZSA9IHByb2Nlc3MuYXJndlsyXTtcbiAgICByZXR1cm4gKGF3YWl0IHJlYWRGaWxlKGZpbGVuYW1lKSkudG9TdHJpbmcoKTtcbn1cblxuY29uc3QgbWFpbiA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZ2V0RmlsZUNvbnRlbnQoKTtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKEdyYW1tYXIuZnJvbUNvbXBpbGVkKENvbXBpbGVkR3JhbW1hcikpO1xuICAgIHBhcnNlci5mZWVkKHRleHQpO1xuICAgIGNvbnN0IGFzdCA9IHBhcnNlci5yZXN1bHRzWzBdO1xuICAgIGF3YWl0IHdyaXRlRmlsZSgnYXN0Lmpzb24nLCBKU09OLnN0cmluZ2lmeShhc3QsIG51bGwsIDQpKTtcbn1cblxubWFpbigpO1xuIl19