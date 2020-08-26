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
   * Show a list of all accounts.
   * GET accounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new account.
   * GET accounts/create
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
   * GET accounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getBalance({ params, request, response, view }) {
    try {
      let balance = 0;
      var index = Accounts.findIndex(
        (x) => x.destination.id === params.account_id
      );
      if (index === -1) {
        return response.status(404).send(balance);
      } else {
        Accounts.forEach((element) => {
          if (element.destination.id === params.account_id) {
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
      if (data.type == "deposit") {
        if (Accounts.length === 0) {
          Accounts.push({
            destination: { id: data.destination, balance: data.amount },
          });
        } else {
          Accounts.forEach((element) => {
            if (element.destination.id === data.destination) {
              element.destination.balance =
                data.amount + element.destination.balance;
            } else {
              var index = Accounts.findIndex(
                (x) => x.destination.id === data.destination
              );
              if (index === -1) {
                Accounts.push({
                  destination: { id: data.destination, balance: data.amount },
                });
              }
            }
          });
        }
        return Accounts;
      } else if (data.type == "withdraw") {
      } else {
      }

      return Accounts;
    } catch (error) {
      return response.status(500).send({ erro: { message: error } });
    }
  }
}

module.exports = AccountController;
