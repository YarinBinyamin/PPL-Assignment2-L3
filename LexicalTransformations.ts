
import { is, map } from "ramda";
import { ClassExp, ProcExp, makeProcExp, makeAppExp, makeIfExp, makeVarDecl, makeVarRef, makeBoolExp, makeDefineExp, makeProgram, isExp, isProgram, Exp, Program, CExp, Binding, VarDecl, AppExp, makePrimOp, makeLitExp, isLitExp, isAppExp, isProcExp, isLetExp, isDefineExp, isIfExp, makeBinding, makeLetExp, IfExp, unparseL3 } from "./L3-ast";
import { Result, makeFailure, makeOk, mapResult } from "../shared/result";
import { isClassExp } from "./L3-ast";
import { parseL3Exp } from "./L3-ast";


/*
Purpose: Transform ClassExp to ProcExp
Signature: class2proc(classExp)
Type: ClassExp => ProcExp
*/
// export const class2proc = (exp: ClassExp): ProcExp =>  {
//     //   return makeProcExp(exp.fields, makeProcExp([makeVarDecl("msg")], [makeIfExp(makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeLitExp(makeSymbolSExp(exp.tag))])), makeAppExp(makeVarRef(exp.methods[0].name), [makeVarRef("msg")]), makeAppExp(makeVarRef("error"), [makeBooleanExp(false)])]));
//     return makeProcExp(exp.fields, [makeProcExp([makeVarDecl("msg")], [checkIF(exp.methods)])]); 
//     };
// const checkIF = (method : Binding[]): IfExp | CExp => {  
//     if(method.length === 0) {
//         return makeBoolExp(false);
//     }
//     else {
//         return makeIfExp(makePrimOp(`(eq? msg '${method[0].var.var})`), makePrimOp(`(quote ${method[0].val})`), checkIF(method.slice(1)));
       
//     } 
    
// }

/*
Purpose: Transform ClassExp to ProcExp
Signature: class2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>  {
    //   return makeProcExp(exp.fields, makeProcExp([makeVarDecl("msg")], [makeIfExp(makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeLitExp(makeSymbolSExp(exp.tag))])), makeAppExp(makeVarRef(exp.methods[0].name), [makeVarRef("msg")]), makeAppExp(makeVarRef("error"), [makeBooleanExp(false)])]));
    return makeProcExp(exp.fields, [makeProcExp([makeVarDecl("msg")], [checkIF(exp.methods)])]); 
    };
const checkIF = (method : Binding[]): IfExp | CExp => {  
    if(method.length === 0) {
        return makeBoolExp(false);
    }
    else {
        return makeIfExp(
        makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeLitExp(`'${method[0].var.var}`)]), 
        makePrimOp(`(${unparseL3(method[0].val)} )`),
        checkIF(method.slice(1)));
    } 
}

// export const class2proc = (exp: ClassExp): ProcExp =>  {
//     const fields: VarDecl[] = exp.fields;
//     const methods: Binding[] = exp.methods;
// '${method[0].var.var}
//     const methodIfs: CExp[] = methods.map((method: Binding) => 
//         makeIfExp(
//             makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeLitExp(`'${method.var.var}`)]),
//             method.val,
//             makeBoolExp(false)
//         )
//     );

//     const outerLambdaBody = makeProcExp([makeVarDecl("msg")], methodIfs.concat(makeBoolExp(false)));
//     return makeProcExp(fields, [outerLambdaBody]);
// };
/*
Purpose: Transform all class forms in the given AST to procs
Signature: lexTransform(AST)
Type: [Exp | Program] => Result<Exp | Program>
*/

// export const lexTransform = (exp: Exp | Program): Result<Exp | Program> => 
//         // isExp(exp) ?
//          isClassExp(exp) ? 
//             makeOk(class2proc(exp))  :
//         isProgram(exp) ? makeOk(makeProgram(exp.exps.map(ex => isDefineExp(ex)  && isClassExp(ex.val) ? makeDefineExp(ex.var, class2proc(ex.val)) : ex))) : makeFailure("Invalid AST");

export const lexTransform = (exp: Exp | Program): Result<Exp | Program> => {
    if (isClassExp(exp)) {
        return makeOk(class2proc(exp));
    } else if (isProgram(exp)) {
        const transformedExps = exp.exps.map(ex => {
            if (isDefineExp(ex) && isClassExp(ex.val)) {
                return makeDefineExp(ex.var, class2proc(ex.val));
            }
            return ex;
        });
        return makeOk(makeProgram(transformedExps));
    } else {
        return makeFailure("Invalid AST");
    }
};