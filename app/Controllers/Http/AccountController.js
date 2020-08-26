"use strict";
const Accounts = use("App/Middleware/Storage");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with accounts
 */
// const accounts = [];
class AccountController {
  constructor() {
    this.Accounts = [];
  }

  /**
   * Reset array of accounts.
   * POST accounts/reset
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async reset({ request, response, view }) {
    try {
      Accounts.splice(0, Accounts.length);

      return response.status(200).send({ message: "OK" });
    } catch (error) {
      return response.status(500).send({ erro: { message: error } });
    }
  }

  /**
   * Display a single account.
   * GET accounts/balance
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getBalance({ params, request, response, view }) {
    const accountId = request.only(["account_id"]);
    try {
      let balance = 0;
      var index = Accounts.findIndex(
        (x) => x.destination.id === accountId.account_id
      );
      if (index === -1) {
        return response.status(404).send(balance);
      } else {
        Accounts.forEach((element) => {
          if (element.destination.id === accountId.account_id) {
            balance = element.destination.balance;
          }
        });
      }
      return balance;
    } catch (error) {
      return response.status(500).send({ erro: { message: error } });
    }
  }
  /**
   * Create/save a new account.
   * POST accounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async createAccount({ request, response }) {
    const data = request.only(["type", "destination", "amount"]);
    try {
      const account = [];

      if (data.type == "deposit") {
        if (Accounts.length === 0) {
          Accounts.push({
            destination: { id: data.destination, balance: data.amount },
          });
          account.push({
            destination: { id: data.destination, balance: data.amount },
          });
        } else {
          Accounts.forEach((element) => {
            if (element.destination.id === data.destination) {
              element.destination.balance =
                data.amount + element.destination.balance;
              account.push(element);
            } else {
              var index = Accounts.findIndex(
                (x) => x.destination.id === data.destination
              );
              if (index === -1) {
                Accounts.push({
                  destination: { id: data.destination, balance: data.amount },
                });
                account.push({
                  destination: { id: data.destination, balance: data.amount },
                });
              }
            }
          });
        }
        return account;
      } else if (data.type == "withdraw") {
        var index = Accounts.findIndex(
          (x) => x.destination.id === data.destination
        );
        if (index === -1) {
          return response.status(404).send(0);
        } else {
          Accounts.forEach((element) => {
            if (element.destination.id === data.destination) {
              element.destination.balance =
                element.destination.balance - data.amount;
              account.push(element);
            }
          });
        }
        return account;
      } else {
      }
    } catch (error) {
      return response.status(500).send({ erro: { message: error } });
    }
  }
}

module.exports = AccountController;
