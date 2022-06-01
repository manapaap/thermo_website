# -*- coding: utf-8 -*-
"""
Uses the thermo module to solve equations of state and pass back calculated
values to the website
"""

import thermo.eos as eos
import numpy as np


gas_constant = 8.31446  # J/mol K


def solve_eos(eqn_state, relevant_vals):
    """
    Solves a cubic equation of state by redirecting to the relevant equation
    of state and then returns the values we cant to calculate.

    Returns a dictionary containing departure functions and the roots for the
    cubic EOS
    """
    if eqn_state == 'vdW':
        solutions = eos.VDW(**relevant_vals)
    elif eqn_state == 'RK':
        solutions = eos.RK(**relevant_vals)
    elif eqn_state == 'SRK':
        solutions = eos.SRK(**relevant_vals)
    else:
        solutions = eos.PR(**relevant_vals)

    departs, roots = process_solutions(solutions)
    return departs, roots


def fugacity(del_g_dep, temp):
    """
    Baby function that returns fugacity using ΔGdep
    """
    return np.exp(del_g_dep / (temp * gas_constant))


def pass_liquid_vals(solved_eos, liquid_depart, roots):
    """
    Does the manual work of taking the solved EOS and adding the
    calculated values to it couldn't think of a cleaner way to do it
    """
    liquid_depart['Δhdep'] = solved_eos.H_dep_l
    liquid_depart['Δudep'] = solved_eos.U_dep_l
    liquid_depart['Δsdep'] = solved_eos.S_dep_l
    liquid_depart['φ'] = fugacity(solved_eos.G_dep_l, solved_eos.T)

    roots['liquid'] = solved_eos.V_l

    return liquid_depart, roots


def pass_vapor_vals(solved_eos, vapor_depart, roots):
    """
    Does the manual work of taking the solved EOS and adding the
    calculated values to it couldn't think of a cleaner way to do it
    """
    vapor_depart['Δhdep'] = solved_eos.H_dep_g
    vapor_depart['Δudep'] = solved_eos.U_dep_g
    vapor_depart['Δsdep'] = solved_eos.S_dep_g
    vapor_depart['φ'] = fugacity(solved_eos.G_dep_g, solved_eos.T)

    roots['vapor'] = solved_eos.V_g

    return vapor_depart, roots


def process_solutions(solved_eos):
    """
    Processes the solutions of the EOS into a nice format for easy printing
    """
    liquid_depart = {}
    vapor_depart = {}
    roots = {}
    departs = {}
    # TODO: check if roots exist before this function is run
    try:
        liquid_depart, roots = pass_liquid_vals(solved_eos, liquid_depart,
                                                roots)
        departs['liquid'] = liquid_depart
    except:
        pass
    try:
        vapor_depart, roots = pass_vapor_vals(solved_eos, vapor_depart, roots)
        departs['vapor'] = vapor_depart
    except:
        pass

    return departs, roots
