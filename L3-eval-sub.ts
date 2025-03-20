// L3-eval.ts
import { is, map } from "ramda";
import { ClassExp, isCExp, isClassExp, isLetExp } from "./L3-ast";
import { BoolExp, CExp, Exp, IfExp, LitExp, NumExp,
         PrimOp, ProcExp, Program, StrExp, VarDecl } from "./L3-ast";
import { isAppExp, isBoolExp, isDefineExp, isIfExp, isLitExp, isNumExp,
             isPrimOp, isProcExp, isStrExp, isVarRef } from "./L3-ast";
import { makeBoolExp, makeLitExp, makeNumExp, makeProcExp, makeStrExp } from "./L3-ast";
import { parseL3Exp } from "./L3-ast";
import { applyEnv, makeEmptyEnv, makeEnv, Env } from "./L3-env-sub";
import { isClosure, makeClosure, Closure, Value , isClass, makeClass, Class, makeObject,isObject, Object, isSymbolSExp } from "./L3-value";
import { first, rest, isEmpty, List, isNonEmptyList } from '../shared/list';
import { isBoolean, isNumber, isString } from "../shared/type-predicates";
import { Result, makeOk, makeFailure, bind, mapResult, mapv } from "../shared/result";
import { renameExps, substitute } from "./substitute";
import { applyPrimitive } from "./evalPrimitive";
import { parse as p } from "../shared/parser";
import { Sexp } from "s-expression";
import { format } from "../shared/format";

import { isExp, isProgram, makeProgram, makeDefineExp, isAtomicExp, makeIfExp, makeAppExp } from "./L3-ast";


import { class2proc } from './LexicalTransformations'; // import the transformation function
import { Console } from "console";

// ========================================================
// Eval functions

const L3applicativeEval = (exp: CExp, env: Env): Result<Value> =>
    isNumExp(exp) ? makeOk(exp.val) : 
    isBoolExp(exp) ? makeOk(exp.val) :
    isStrExp(exp) ? makeOk(exp.val) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? applyEnv(env, exp.var) :
    isLitExp(exp) ? makeOk(exp.val) :
    isIfExp(exp) ? evalIf(exp, env) :
    isProcExp(exp) ? evalProc(exp, env) :
    isClassExp(exp) ? evalClass(exp, env) :
    isAppExp(exp) ? bind(L3applicativeEval(exp.rator, env), (rator: Value) =>
                        bind(mapResult(param => 
                            L3applicativeEval(param, env), 
                              exp.rands), 
                            (rands: Value[]) =>
                                L3applyProcedure(rator, rands, env))) :
    isLetExp(exp) ? makeFailure('"let" not supported (yet)') :
    
    makeFailure('Never');

export const isTrueValue = (x: Value): boolean =>
    ! (x === false);

const evalIf = (exp: IfExp, env: Env): Result<Value> =>
    bind(L3applicativeEval(exp.test, env), (test: Value) => 
        isTrueValue(test) ? L3applicativeEval(exp.then, env) : 
        L3applicativeEval(exp.alt, env));

const evalProc = (exp: ProcExp, env: Env): Result<Closure> =>
    makeOk(makeClosure(exp.args, exp.body));

const evalClass = (exp: ClassExp, env: Env): Result<Value> =>
    makeOk(makeClass(exp.fields, exp.methods));

const L3applyProcedure = (proc: Value, args: Value[], env: Env): Result<Value> =>
    isPrimOp(proc) ? applyPrimitive(proc, args) :
    isClosure(proc) ? applyClosure(proc, args, env) :
    isClass(proc) ? applyClass(proc, args, env) :
    isObject(proc) ? applyObject(proc, args, env) :
    makeFailure(`Bad procedure ${format(proc)}`);




//try 1
const applyClass = (proc: Class, args: Value[], env: Env): Result<Value> => 
    makeOk(makeObject(proc, args, makeEmptyEnv()));


// try 2 
// const applyClass = (proc: Class, args: Value[], env: Env): Result<Value> => 
//     const newMethods = map((m: Binding) => m, proc.methods);

// const applyObject = (proc: Object, args: Value[], env:Env): Result<Value> => {
//     const [methodName, ...methodArgs] = args;
//     if (isSymbolSExp(methodName)) {
//         const methods = proc.class.methods;
//         const symbolName = methodName.val;
//         const method = methods.find(m => m.var.var === symbolName);

//         if (!method) {
//             return makeFailure(`Unrecognized method: ${symbolName}`);
//         }

//         const methodClosure = method.val;
//         if (isClosure(methodClosure)) {
//             return applyClosure(methodClosure, methodArgs, env);
//         } else {
//             return makeFailure(`Invalid method value: ${format(methodClosure)}`);
//         }
//     }
//     return makeFailure(`Invalid method call: ${format(args)}`);
// };

// const evalObject = (c: Class, args: Value[], env: Env): Result<Object> => {
//     const fields = map((f: VarDecl) => f.var, c.fields);
//     const objectValues: CExp[] = map(valueToLitExp, args);
//     const 
//     const body = map((b: ) => b.val, c.methods);
//     const newBody = substitute(body, fields, objectValues);
//     return makeOk(makeObject(c, objectValues));
// };

const applyObject = (proc: Object, args: Value[], env:Env): Result<Value> => {
    if(isNonEmptyList<Value>(args)){
        if(isSymbolSExp(args[0])){
            const methods = proc.class.methods;
            const symbolName = args[0].val;
            const method = proc.class.methods.find(m => m.var.var === symbolName);
            if (method === undefined) {
                return makeFailure(`Unrecognized method: ${symbolName}`);
            }
            const methodClosure = method.val as ProcExp;
            const arrays = [...args.slice(1),...proc.fields]
            const inside = [...methodClosure.args, ...proc.class.fields];
            const clos = makeClosure(inside, methodClosure.body);
                if (isClosure(clos)) {
                    return applyClosure(clos, arrays, makeEmptyEnv());
                }
                else {
                    return makeFailure(`Invalid method value: ${symbolName}`);
                }
        }
    }
    return makeFailure(`Invalid method value`);  
}




 // // const methodBody = method.val;
    // // const methodParams = methodBody[0].params;
    // // const methodBodyExp = methodBody[0].body;
    
    // // const methodEnv = makeEnv(methodParams[0].var, args[1], proc.class.env); 
    // if (isClosure(method.val)) {
    //     return applyClosure(method.val, args.slice(1), proc.class.env);
    // } else {
    //     return makeFailure(`Invalid method value: ${format(method.val)}`);
    // }
    
    // //return evalSequence(methodBodyExp, methodEnv);

// Applications are computed by substituting computed
// values into the body of the closure.
// To make the types fit - computed values of params must be
// turned back in Literal Expressions that eval to the computed value.
const valueToLitExp = (v: Value): NumExp | BoolExp | StrExp | LitExp | PrimOp | ProcExp =>
    isNumber(v) ? makeNumExp(v) :
    isBoolean(v) ? makeBoolExp(v) :
    isString(v) ? makeStrExp(v) :
    isPrimOp(v) ? v :
    isClosure(v) ? makeProcExp(v.params, v.body) :
    makeLitExp(v);

const applyClosure = (proc: Closure, args: Value[], env: Env): Result<Value> => {
    const vars = map((v: VarDecl) => v.var, proc.params);
    const body = renameExps(proc.body);
    const litArgs : CExp[] = map(valueToLitExp, args);
    return evalSequence(substitute(body, vars, litArgs), env);
    //return evalSequence(substitute(proc.body, vars, litArgs), env);
}

// Evaluate a sequence of expressions (in a program)
export const evalSequence = (seq: List<Exp>, env: Env): Result<Value> =>
    isNonEmptyList<Exp>(seq) ? 
        isDefineExp(first(seq)) ? evalDefineExps(first(seq), rest(seq), env) :
        evalCExps(first(seq), rest(seq), env) :
    makeFailure("Empty sequence");

const evalCExps = (first: Exp, rest: Exp[], env: Env): Result<Value> =>
    isCExp(first) && isEmpty(rest) ? L3applicativeEval(first, env) :
    isCExp(first) ? bind(L3applicativeEval(first, env), _ => 
                            evalSequence(rest, env)) :
    makeFailure("Never");

// Eval a sequence of expressions when the first exp is a Define.
// Compute the rhs of the define, extend the env with the new binding
// then compute the rest of the exps in the new env.
const evalDefineExps = (def: Exp, exps: Exp[], env: Env): Result<Value> =>
    isDefineExp(def) ? bind(L3applicativeEval(def.val, env), 
                            (rhs: Value) => 
                                evalSequence(exps, 
                                    makeEnv(def.var.var, rhs, env))) :
    makeFailure(`Unexpected in evalDefine: ${format(def)}`);

// Main program
export const evalL3program = (program: Program): Result<Value> =>
    evalSequence(program.exps, makeEmptyEnv());

export const evalParse = (s: string): Result<Value> =>
    bind(p(s), (sexp: Sexp) => 
        bind(parseL3Exp(sexp), (exp: Exp) =>
            evalSequence([exp], makeEmptyEnv())));



