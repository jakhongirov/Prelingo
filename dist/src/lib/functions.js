"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTree = void 0;
const buildTree = (rows) => __awaiter(void 0, void 0, void 0, function* () {
    const map = {};
    rows.forEach((item) => {
        map[item.user_id] = Object.assign(Object.assign({}, item), { child: [] });
    });
    let root = [];
    rows.forEach((item) => {
        if (item.parent_id && map[item.parent_id]) {
            map[item.parent_id].child.push(map[item.user_id]);
        }
        else {
            root.push(map[item.user_id]);
        }
    });
    return root;
});
exports.buildTree = buildTree;
