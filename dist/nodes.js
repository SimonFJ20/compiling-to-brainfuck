"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntNode = exports.HexNode = exports.UnaryNode = exports.SubtractionNode = exports.AdditionNode = exports.BinaryOperationNode = exports.CallNode = exports.AccessNode = exports.ReturnNode = exports.AssigmentNode = exports.DeclarationNode = exports.IfNode = exports.IfElseNode = exports.WhileNode = exports.BlockNode = exports.DefinitionNode = exports.ImportNode = exports.NamespaceNode = exports.FileNode = exports.ValueNode = exports.Node = exports.Pos = void 0;
class Pos {
    constructor(line, column, length) {
        this.line = line;
        this.column = column;
        this.length = length;
    }
    static from(token) {
        return new Pos(token.line, token.col, token.text.length);
    }
}
exports.Pos = Pos;
class Node {
    constructor(type, begin, end) {
        this.type = type;
        this.begin = begin;
        this.end = end;
    }
}
exports.Node = Node;
class ValueNode extends Node {
    constructor(valueType, token, pos) {
        super('value', pos, pos);
        this.valueType = valueType;
        this.value = token.value;
    }
}
exports.ValueNode = ValueNode;
class FileNode extends Node {
    constructor(namespace, statements, begin, end) {
        super('file', begin, end);
        this.namespace = namespace;
        this.statements = statements;
    }
}
exports.FileNode = FileNode;
class NamespaceNode extends Node {
    constructor(name, begin, end) {
        super('namespace', begin, end);
        this.name = name;
    }
}
exports.NamespaceNode = NamespaceNode;
class ImportNode extends Node {
    constructor(name, begin, end) {
        super('import', begin, end);
        this.name = name;
    }
}
exports.ImportNode = ImportNode;
class DefinitionNode extends Node {
    constructor(name, args, body, begin, end) {
        super('definition', begin, end);
        this.name = name;
        this.args = args;
        this.body = body;
    }
}
exports.DefinitionNode = DefinitionNode;
class BlockNode extends Node {
    constructor(nodes, begin, end) {
        super('block', begin, end);
        this.nodes = nodes;
    }
}
exports.BlockNode = BlockNode;
class WhileNode extends Node {
    constructor(condition, body, begin, end) {
        super('while', begin, end);
        this.condition = condition;
        this.body = body;
    }
}
exports.WhileNode = WhileNode;
class IfElseNode extends Node {
    constructor(condition, truthy, falsy, begin, end) {
        super('if_else', begin, end);
        this.condition = condition;
        this.truthy = truthy;
        this.falsy = falsy;
    }
    static from(ifNode, falsy, end) {
        return new IfElseNode(ifNode.condition, ifNode.truthy, falsy, ifNode.begin, end);
    }
}
exports.IfElseNode = IfElseNode;
class IfNode extends Node {
    constructor(condition, truthy, begin, end) {
        super('if', begin, end);
        this.condition = condition;
        this.truthy = truthy;
    }
}
exports.IfNode = IfNode;
class DeclarationNode extends Node {
    constructor(name, value, begin, end) {
        super('declaration', begin, end);
        this.name = name;
        this.value = value;
    }
}
exports.DeclarationNode = DeclarationNode;
class AssigmentNode extends Node {
    constructor(name, value, begin, end) {
        super('assignment', begin, end);
        this.name = name;
        this.value = value;
    }
}
exports.AssigmentNode = AssigmentNode;
class ReturnNode extends Node {
    constructor(value, begin, end) {
        super('return', begin, end);
        this.value = value;
    }
}
exports.ReturnNode = ReturnNode;
class AccessNode extends Node {
    constructor(name, begin, end) {
        super('access', begin, end);
        this.name = name;
    }
}
exports.AccessNode = AccessNode;
class CallNode extends Node {
    constructor(name, args, begin, end) {
        super('call', begin, end);
        this.name = name;
        this.args = args;
    }
}
exports.CallNode = CallNode;
class BinaryOperationNode extends Node {
    constructor(type, left, right, begin, end) {
        super(type, begin, end);
        this.left = left;
        this.right = right;
    }
}
exports.BinaryOperationNode = BinaryOperationNode;
class AdditionNode extends BinaryOperationNode {
    constructor(left, right, begin, end) {
        super('add', left, right, begin, end);
    }
}
exports.AdditionNode = AdditionNode;
class SubtractionNode extends BinaryOperationNode {
    constructor(left, right, begin, end) {
        super('sub', left, right, begin, end);
    }
}
exports.SubtractionNode = SubtractionNode;
class UnaryNode extends Node {
    constructor(value, begin, end) {
        super('unary', begin, end);
        this.value = value;
    }
}
exports.UnaryNode = UnaryNode;
class HexNode extends ValueNode {
    constructor(token, pos) {
        super('hex', token, pos);
    }
}
exports.HexNode = HexNode;
class IntNode extends ValueNode {
    constructor(token, pos) {
        super('int', token, pos);
    }
}
exports.IntNode = IntNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJub2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFXQSxNQUFhLEdBQUc7SUFLWixZQUFhLElBQVksRUFBRSxNQUFjLEVBQUUsTUFBYztRQUNyRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRU0sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFZO1FBQzNCLE9BQU8sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNKO0FBZEQsa0JBY0M7QUFFRCxNQUFzQixJQUFJO0lBS3RCLFlBQWEsSUFBWSxFQUFFLEtBQVUsRUFBRSxHQUFRO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7Q0FDSjtBQVZELG9CQVVDO0FBRUQsTUFBc0IsU0FBVSxTQUFRLElBQUk7SUFJeEMsWUFBWSxTQUFpQixFQUFFLEtBQVksRUFBRSxHQUFRO1FBQ2pELEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFURCw4QkFTQztBQU1ELE1BQWEsUUFBUyxTQUFRLElBQUk7SUFJOUIsWUFBYSxTQUF3QixFQUFFLFVBQStCLEVBQUUsS0FB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Q0FDSjtBQVBELDhCQU9DO0FBRUQsTUFBYSxPQUFRLFNBQVEsU0FBUztJQUNsQyxZQUFZLEtBQVksRUFBRSxHQUFRO1FBQzlCLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQUpELDBCQUlDO0FBRUQsTUFBYSxPQUFRLFNBQVEsU0FBUztJQUNsQyxZQUFZLEtBQVksRUFBRSxHQUFRO1FBQzlCLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQUpELDBCQUlDIiwic291cmNlc0NvbnRlbnQiOlsiXG50eXBlIFRva2VuID0ge1xuICAgIHR5cGU6IHN0cmluZyxcbiAgICB2YWx1ZTogc3RyaW5nLFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBvZmZzZXQ6IG51bWJlcixcbiAgICBsaW5lQnJlYWtzOiBudW1iZXIsXG4gICAgbGluZTogbnVtYmVyLFxuICAgIGNvbDogbnVtYmVyLFxufVxuXG5leHBvcnQgY2xhc3MgUG9zIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyBjb2x1bW46IG51bWJlcjtcbiAgICBwdWJsaWMgbGVuZ3RoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciAobGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbSh0b2tlbjogVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3ModG9rZW4ubGluZSwgdG9rZW4uY29sLCB0b2tlbi50ZXh0Lmxlbmd0aCk7XG4gICAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9kZSB7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYmVnaW46IFBvcztcbiAgICBwdWJsaWMgZW5kOiBQb3M7XG5cbiAgICBjb25zdHJ1Y3RvciAodHlwZTogc3RyaW5nLCBiZWdpbjogUG9zLCBlbmQ6IFBvcykge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmJlZ2luID0gYmVnaW47XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZhbHVlTm9kZSBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyB2YWx1ZVR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlVHlwZTogc3RyaW5nLCB0b2tlbjogVG9rZW4sIHBvczogUG9zKSB7XG4gICAgICAgIHN1cGVyKCd2YWx1ZScsIHBvcywgcG9zKTtcbiAgICAgICAgdGhpcy52YWx1ZVR5cGUgPSB2YWx1ZVR5cGU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0b2tlbi52YWx1ZTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBUb3BsZXZlbFN0YXRlbWVudCB7XG5cbn1cblxuZXhwb3J0IGNsYXNzIEZpbGVOb2RlIGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIG5hbWVzcGFjZTogTmFtZXNwYWNlTm9kZTtcbiAgICBwdWJsaWMgc3RhdGVtZW50czogVG9wbGV2ZWxTdGF0ZW1lbnRbXTtcblxuICAgIGNvbnN0cnVjdG9yIChuYW1lc3BhY2U6IE5hbWVzcGFjZU5vZGUsIHN0YXRlbWVudHM6IFRvcGxldmVsU3RhdGVtZW50W10sIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdmaWxlJywgYmVnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICAgICAgICB0aGlzLnN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5hbWVzcGFjZU5vZGUgZXh0ZW5kcyBOb2RlIGltcGxlbWVudHMgVG9wbGV2ZWxTdGF0ZW1lbnQge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvciAobmFtZTogc3RyaW5nLCBiZWdpbjogUG9zLCBlbmQ6IFBvcykge1xuICAgICAgICBzdXBlcignbmFtZXNwYWNlJywgYmVnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1wb3J0Tm9kZSBleHRlbmRzIE5vZGUgaW1wbGVtZW50cyBUb3BsZXZlbFN0YXRlbWVudCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yIChuYW1lOiBzdHJpbmcsIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdpbXBvcnQnLCBiZWdpbiwgZW5kKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWZpbml0aW9uTm9kZSBleHRlbmRzIE5vZGUgaW1wbGVtZW50cyBUb3BsZXZlbFN0YXRlbWVudCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXJnczogc3RyaW5nW107XG4gICAgcHVibGljIGJvZHk6IEJsb2NrTm9kZTtcblxuICAgIGNvbnN0cnVjdG9yIChuYW1lOiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdLCBib2R5OiBCbG9ja05vZGUsIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdkZWZpbml0aW9uJywgYmVnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgQmxvY2tTdGF0ZW1lbnQge1xuXG59XG5cbmV4cG9ydCBjbGFzcyBCbG9ja05vZGUgZXh0ZW5kcyBOb2RlIGltcGxlbWVudHMgQmxvY2tTdGF0ZW1lbnQge1xuICAgIHB1YmxpYyBub2RlczogQmxvY2tTdGF0ZW1lbnRbXTtcblxuICAgIGNvbnN0cnVjdG9yIChub2RlczogTm9kZVtdLCBiZWdpbjogUG9zLCBlbmQ6IFBvcykge1xuICAgICAgICBzdXBlcignYmxvY2snLCBiZWdpbiwgZW5kKTtcbiAgICAgICAgdGhpcy5ub2RlcyA9IG5vZGVzO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdoaWxlTm9kZSBleHRlbmRzIE5vZGUgaW1wbGVtZW50cyBCbG9ja1N0YXRlbWVudCB7XG4gICAgcHVibGljIGNvbmRpdGlvbjogVmFsdWVOb2RlO1xuICAgIHB1YmxpYyBib2R5OiBCbG9ja1N0YXRlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yIChjb25kaXRpb246IFZhbHVlTm9kZSwgYm9keTogQmxvY2tTdGF0ZW1lbnQsIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCd3aGlsZScsIGJlZ2luLCBlbmQpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJZkVsc2VOb2RlIGV4dGVuZHMgTm9kZSBpbXBsZW1lbnRzIEJsb2NrU3RhdGVtZW50IHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBWYWx1ZU5vZGU7XG4gICAgcHVibGljIHRydXRoeTogQmxvY2tTdGF0ZW1lbnQ7XG4gICAgcHVibGljIGZhbHN5OiBCbG9ja1N0YXRlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yIChjb25kaXRpb246IFZhbHVlTm9kZSwgdHJ1dGh5OiBCbG9ja1N0YXRlbWVudCwgZmFsc3k6IEJsb2NrU3RhdGVtZW50LCBiZWdpbjogUG9zLCBlbmQ6IFBvcykge1xuICAgICAgICBzdXBlcignaWZfZWxzZScsIGJlZ2luLCBlbmQpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50cnV0aHkgPSB0cnV0aHk7XG4gICAgICAgIHRoaXMuZmFsc3kgPSBmYWxzeTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZyb20oaWZOb2RlOiBJZk5vZGUsIGZhbHN5OiBCbG9ja1N0YXRlbWVudCwgZW5kOiBQb3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJZkVsc2VOb2RlKGlmTm9kZS5jb25kaXRpb24sIGlmTm9kZS50cnV0aHksIGZhbHN5LCBpZk5vZGUuYmVnaW4sIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSWZOb2RlIGV4dGVuZHMgTm9kZSBpbXBsZW1lbnRzIEJsb2NrU3RhdGVtZW50IHtcbiAgICBwdWJsaWMgY29uZGl0aW9uOiBWYWx1ZU5vZGU7XG4gICAgcHVibGljIHRydXRoeTogQmxvY2tTdGF0ZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvciAoY29uZGl0aW9uOiBWYWx1ZU5vZGUsIHRydXRoeTogQmxvY2tTdGF0ZW1lbnQsIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdpZicsIGJlZ2luLCBlbmQpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgICAgdGhpcy50cnV0aHkgPSB0cnV0aHk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVjbGFyYXRpb25Ob2RlIGV4dGVuZHMgTm9kZSBpbXBsZW1lbnRzIEJsb2NrU3RhdGVtZW50LCBUb3BsZXZlbFN0YXRlbWVudCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IFZhbHVlTm9kZTtcblxuICAgIGNvbnN0cnVjdG9yIChuYW1lOiBzdHJpbmcsIHZhbHVlOiBWYWx1ZU5vZGUsIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdkZWNsYXJhdGlvbicsIGJlZ2luLCBlbmQpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzaWdtZW50Tm9kZSBleHRlbmRzIE5vZGUgaW1wbGVtZW50cyBCbG9ja1N0YXRlbWVudCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IFZhbHVlTm9kZTtcblxuICAgIGNvbnN0cnVjdG9yIChuYW1lOiBzdHJpbmcsIHZhbHVlOiBWYWx1ZU5vZGUsIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdhc3NpZ25tZW50JywgYmVnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXR1cm5Ob2RlIGV4dGVuZHMgTm9kZSBpbXBsZW1lbnRzIEJsb2NrU3RhdGVtZW50IHtcbiAgICBwdWJsaWMgdmFsdWU6IFZhbHVlTm9kZTtcbiAgICBcbiAgICBjb25zdHJ1Y3RvciAodmFsdWU6IFZhbHVlTm9kZSwgYmVnaW46IFBvcywgZW5kOiBQb3MpIHtcbiAgICAgICAgc3VwZXIoJ3JldHVybicsIGJlZ2luLCBlbmQpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWNjZXNzTm9kZSBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvciAobmFtZTogc3RyaW5nLCBiZWdpbjogUG9zLCBlbmQ6IFBvcykge1xuICAgICAgICBzdXBlcignYWNjZXNzJywgYmVnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2FsbE5vZGUgZXh0ZW5kcyBOb2RlIGltcGxlbWVudHMgQmxvY2tTdGF0ZW1lbnQge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGFyZ3M6IFZhbHVlTm9kZVtdO1xuXG4gICAgY29uc3RydWN0b3IgKG5hbWU6IHN0cmluZywgYXJnczogVmFsdWVOb2RlW10sIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdjYWxsJywgYmVnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5T3BlcmF0aW9uTm9kZSBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyBsZWZ0OiBWYWx1ZU5vZGU7XG4gICAgcHVibGljIHJpZ2h0OiBWYWx1ZU5vZGU7XG4gICAgXG4gICAgY29uc3RydWN0b3IgKHR5cGU6IHN0cmluZywgbGVmdDogVmFsdWVOb2RlLCByaWdodDogVmFsdWVOb2RlLCBiZWdpbjogUG9zLCBlbmQ6IFBvcykge1xuICAgICAgICBzdXBlcih0eXBlLCBiZWdpbiwgZW5kKTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFkZGl0aW9uTm9kZSBleHRlbmRzIEJpbmFyeU9wZXJhdGlvbk5vZGUge1xuICAgIGNvbnN0cnVjdG9yIChsZWZ0OiBWYWx1ZU5vZGUsIHJpZ2h0OiBWYWx1ZU5vZGUsIGJlZ2luOiBQb3MsIGVuZDogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdhZGQnLCBsZWZ0LCByaWdodCwgYmVnaW4sIGVuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VidHJhY3Rpb25Ob2RlIGV4dGVuZHMgQmluYXJ5T3BlcmF0aW9uTm9kZSB7XG4gICAgY29uc3RydWN0b3IgKGxlZnQ6IFZhbHVlTm9kZSwgcmlnaHQ6IFZhbHVlTm9kZSwgYmVnaW46IFBvcywgZW5kOiBQb3MpIHtcbiAgICAgICAgc3VwZXIoJ3N1YicsIGxlZnQsIHJpZ2h0LCBiZWdpbiwgZW5kKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmFyeU5vZGUgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IFZhbHVlTm9kZTtcbiAgICBcbiAgICBjb25zdHJ1Y3RvciAodmFsdWU6IFZhbHVlTm9kZSwgYmVnaW46IFBvcywgZW5kOiBQb3MpIHtcbiAgICAgICAgc3VwZXIoJ3VuYXJ5JywgYmVnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIZXhOb2RlIGV4dGVuZHMgVmFsdWVOb2RlIHtcbiAgICBjb25zdHJ1Y3Rvcih0b2tlbjogVG9rZW4sIHBvczogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdoZXgnLCB0b2tlbiwgcG9zKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnROb2RlIGV4dGVuZHMgVmFsdWVOb2RlIHtcbiAgICBjb25zdHJ1Y3Rvcih0b2tlbjogVG9rZW4sIHBvczogUG9zKSB7XG4gICAgICAgIHN1cGVyKCdpbnQnLCB0b2tlbiwgcG9zKTtcbiAgICB9XG59XG5cbiJdfQ==