import * as Immutable from 'immutable';
import { PDAConfiguration, PDARule, isSubset } from './pda';

export class NPDARulebook<T> {
  constructor(public rules: PDARule<T>[]) {
  }

  nextConfigurations(configurations: Immutable.Set<any>, character: string | null): Immutable.Set<any> {
    let results:any[][] = []
    for (const conf of configurations) {
      results.push(this.followRulesFor(conf, character).flat())
    }
    return Immutable.Set(results.flat())
  }

  followRulesFor(configuration: PDAConfiguration<T>, character: string | null): any[] {
    const rules =  this.rulesFor(configuration, character)
    const confs:any[] = []
    for (const rule of rules) {
      confs.push(rule.follow(configuration))
    }
    return confs
  }

  rulesFor(configuration: PDAConfiguration<T>, character: string | null): (Immutable.Set<any>) {
    const rls: PDARule<T>[] = []
    for (const rule of this.rules) {
      if (rule.appliesTo(configuration, character)) {
        rls.push(rule)
      }
    }
    return Immutable.Set(rls)
  }

  mergeAndUniq(configurations: Immutable.Set<any>, moreConfigurations: Immutable.Set<any>): Immutable.Set<any> {
    // const confs: Immutable.Set<PDAConfiguration<T>> = configurations
    // const confs: Immutable.Set<any> = Immutable.Set([])

    const confs = []
    for (const mconf of moreConfigurations) {
      let isNotExist = true
      for (const conf of configurations) {
        if(conf.isSame(mconf)) {
          isNotExist = false
        }
      }
      if (isNotExist) {
        confs.push(mconf)
      }
    }
    for (const conf of configurations) {
      confs.push(conf)
    }

    return Immutable.Set(confs)
  }

  followFreeMoves(configurations: Immutable.Set<any>): Immutable.Set<any> {
    const moreConfigurations: Immutable.Set<PDAConfiguration<T>> = this.nextConfigurations(configurations, null)

    if (isSubset(configurations, moreConfigurations)) {
      return configurations
    } else {
      return this.followFreeMoves(this.mergeAndUniq(configurations, moreConfigurations))
    }
  }
}

export class NPDA<T> {
  constructor(private currentConfigurations: Immutable.Set<any>, private acceptStates: Immutable.Set<any>, private ruleBook: NPDARulebook<T>) {
  }

  getCurrentConfigrations(): Immutable.Set<any> {
    return this.ruleBook.followFreeMoves(this.currentConfigurations)
  }

  isAccepting(): boolean {
    for (const currentConf of this.getCurrentConfigrations()) {
      console.log(currentConf)
      console.log(currentConf.state)
      for (const acceptState of this.acceptStates) {
        console.log(acceptState)
        if (currentConf.state == acceptState) {
          return true
        }
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentConfigurations = this.ruleBook.nextConfigurations(this.getCurrentConfigrations(), character)
  }

  readString(characters: string): void {
    for (const char of characters) {
      this.readCharacter(char)
    }
  }
}
