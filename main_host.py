# -*- coding: utf-8 -*-
"""
Created on Mon May 30 13:42:33 2022

@author: Aakas

Thermo Website: this script hosts the main section of the website, but
relies upon other scripts to perform the actual math
"""

from os import chdir
import streamlit as st
import pandas as pd
from sys import platform


if platform == 'win32':
    chdir('C:/Users/Aakas/Documents/School/CHBE_2250/')
from eos_solver import solve_eos


def equation_of_state(column):
    """
    Allows a user to choose a given equation of state

    Returns chosen EOS from key
    """
    with column:
        chosen_eos = st.radio(
            'Choose an Equation of State!',
            ('van der Walls',
             'Redlich-Kwong',
             'Soave-Redlich-Kwong',
             'Peng-Robinson'))

        matchup = {
            'van der Walls': 'vdW',
            'Redlich-Kwong': 'RK',
            'Soave-Redlich-Kwong': 'SRK',
            'Peng-Robinson': 'PR'}
        return matchup[chosen_eos]


def get_sub(x):
    """
    Subscript function I stole from somewhere
    """
    normal = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv" +
              "wxyz0123456789+-=()")
    sub_s = ("ₐ₈CDₑբGₕᵢⱼₖₗₘₙₒₚQᵣₛₜᵤᵥwₓᵧZₐ♭꜀ᑯₑբ₉ₕᵢⱼₖₗₘₙₒₚ૧ᵣₛₜᵤᵥ" +
             "wₓᵧ₂₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎")
    res = x.maketrans(''.join(normal), ''.join(sub_s))
    return x.translate(res)


def get_sup(x):
    """
    Superscript function I stile from somewhere
    """
    normal = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv" +
              "wxyz0123456789+-=()")
    super_s = ("ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛ" +
               "ʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾")
    res = x.maketrans(''.join(normal), ''.join(super_s))
    return x.translate(res)


def molecule(column):
    """
    Allows a user to choose a molecule of interest from the list

    Returns critical parameters of relevance
    """
    constants_df = pd.read_csv('thermo_constants.csv')
    options = list(constants_df['name'])

    with column:
        chosen_molecule = st.selectbox(
            'Choose a molecule of interest',
            (['Custom'] + options))

        st.write('If using custom values')
        cr_temp = st.number_input(f'T{get_sub("c")} (K)')
        cr_pres = st.number_input(f'P{get_sub("c")} (bar)')
        accen_fac = st.number_input('ω')

        if chosen_molecule == 'Custom':
            return cr_temp, cr_pres, accen_fac
        else:
            params = constants_df[constants_df['name'] == chosen_molecule]
            return (float(params['critical_temp']),
                    float(params['critical_pressure']),
                    float(params['accentric_factor']))


def conditions(column):
    """
    Allow the user to choose a temperature/pressure

    Returns that temperature/pressure
    """
    with column:
        st.write('Define a state of interest')
        temp = st.number_input('Temperature (K)')
        pres = st.number_input('Pressure (bar)')

        return temp, pres


def roots(column, roots):
    """
    Displays the roots of the cubic EOS, corresponding to volume
    """
    with column:
        st.write('Roots to the cubic EOS')
        for key, value in roots.items():
            st.write(f'{key.capitalize()} root:')
            st.write(f'v = {value:.8f} m{get_sup("3")} mol{get_sup("-1")}')


def departure_fxn(column, depart_vals, depart_units, depart_disp):
    """
    Prints results for departure functions for internal energy, enthalpy,
    entropy, and fugacity (last is technicaly not a departure function
    but is related)
    """
    with column:
        for key, value in depart_vals.items():
            st.write(f'{key.capitalize()} departure functions:')
            for important, worth in value.items():
                st.write(f'{depart_disp[important]} = ' +
                         f'{worth:.4f} {depart_units[important]}')


def base_vals():
    """
    Sets blank values for departure functions alongside relevant units for
    printing

    Might be an issue for later when actually calculating values, remember if
    calculated departure function values are not rendering correctly
    """
    depart_disp = {'Δhdep': f'Δh{get_sup("dep")}',
                   'Δudep': f'Δu{get_sup("dep")}',
                   'Δsdep': f'Δs{get_sup("dep")}',
                   'φ': 'φ'}
    depart_units = {'Δhdep': f'J mol{get_sup("-1")}',
                    'Δudep': f'J mol{get_sup("-1")}',
                    'Δsdep': f'J mol{get_sup("-1")} K mol{get_sup("-1")}',
                    'φ': ''}
    depart_base = {'Δhdep': '',
                   'Δudep': '',
                   'Δsdep': '',
                   'φ': ''}
    return depart_units, depart_base, depart_disp


def process_inputs(chosen_eos, cr_temp, cr_pres, accen_fac, temp, pres):
    """
    Turns the various user inpute into a dictionary for easier passing and
    handling by thermo eos library. Also rescales pressure to pascals
    during the process for the same reason
    """
    if (cr_temp or cr_pres or accen_fac or temp or pres) < 0:
        st.write('INVALID INPUTS: Please enter valid inputs')
        return False

    relevant_vals = {'Tc': cr_temp,
                     'Pc': cr_pres * 1e5,
                     'omega': accen_fac,
                     'T': temp,
                     'P': pres * 1e5}
    return relevant_vals


def main():
    depart_units, depart_base, depart_disp = base_vals()

    st.title("Aakash's Website for Solving Cubic Equations of State")
    left_column, right_column, leftest_column = st.columns(3)

    chosen_eos = equation_of_state(left_column)
    cr_temp, cr_pres, accen_fac = molecule(right_column)
    temp, pres = conditions(left_column)

    if left_column.button('Calculate!'):
        relevant_vals = process_inputs(chosen_eos, cr_temp, cr_pres,
                                       accen_fac, temp, pres)
        if relevant_vals:
            departs, volume_roots = solve_eos(chosen_eos, relevant_vals)
            # right column
            roots(leftest_column, volume_roots)
            # left column
            departure_fxn(leftest_column, departs, depart_units, depart_disp)
    else:
        st.write('')


if __name__ == '__main__':
    main()
