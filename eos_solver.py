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


def compressibility(solved_eos, mode='v'):
    """
    Baby function to return compressability of state
    """
    if mode == 'v':
        volume = solved_eos.V_g
    elif mode == 'l':
        volume = solved_eos.V_l
    else:
        pass  # TODO: need to add capacity to check for the meaningless root

    compress = solved_eos.P * volume / (gas_constant * solved_eos.T)

    return compress


def pass_liquid_vals(solved_eos, liquid_depart, liquid_roots):
    """
    Does the manual work of taking the solved EOS and adding the
    calculated values to it couldn't think of a cleaner way to do it
    """
    liquid_depart['Δhdep'] = solved_eos.H_dep_l
    liquid_depart['Δudep'] = solved_eos.U_dep_l
    liquid_depart['Δsdep'] = solved_eos.S_dep_l
    liquid_depart['Δgdep'] = solved_eos.G_dep_l
    liquid_depart['φ'] = fugacity(solved_eos.G_dep_l, solved_eos.T)

    liquid_roots['v'] = solved_eos.V_l
    liquid_roots['z'] = compressibility(solved_eos, 'l')

    return liquid_depart, liquid_roots


def pass_vapor_vals(solved_eos, vapor_depart, vapor_roots):
    """
    Does the manual work of taking the solved EOS and adding the
    calculated values to it couldn't think of a cleaner way to do it
    """
    vapor_depart['Δhdep'] = solved_eos.H_dep_g
    vapor_depart['Δudep'] = solved_eos.U_dep_g
    vapor_depart['Δsdep'] = solved_eos.S_dep_g
    vapor_depart['Δgdep'] = solved_eos.G_dep_g
    vapor_depart['φ'] = fugacity(solved_eos.G_dep_g, solved_eos.T)

    vapor_roots['v'] = solved_eos.V_g
    vapor_roots['z'] = compressibility(solved_eos, 'v')

    return vapor_depart, vapor_roots


def middle_volume(solved_eos):
    """
    Determine if middle (meaningless) volume exists, and if it does,
    returns it
    """
    pass


def process_solutions(solved_eos):
    """
    Processes the solutions of the EOS into a nice format for easy printing
    """
    liquid_depart, vapor_depart = {}, {}
    liquid_roots, vapor_roots = {}, {}
    roots, departs = {}, {}

    try:
        liquid_depart, liquid_roots = pass_liquid_vals(solved_eos,
                                                       liquid_depart,
                                                       liquid_roots)
        departs['liquid'] = liquid_depart
        roots['liquid'] = liquid_roots
    except:
        pass
    try:
        vapor_depart, vapor_roots = pass_vapor_vals(solved_eos,
                                                    vapor_depart,
                                                    vapor_roots)
        departs['vapor'] = vapor_depart
        roots['vapor'] = vapor_roots
    except:
        pass

    return departs, roots
