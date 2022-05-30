# -*- coding: utf-8 -*-
"""
Created on Mon May 30 13:42:33 2022

@author: Aakas
"""

from os import chdir
import streamlit as st

chdir('C:/Users/Aakas/Documents/School/CHBE_2250/')


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
    normal = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv" +
              "wxyz0123456789+-=()")
    super_s = ("ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖ۹ʳˢᵗᵘᵛ" +
               "ʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾")
    res = x.maketrans(''.join(normal), ''.join(super_s))
    return x.translate(res)


def molecule(column):
    """
    Allows a user to choose a molecule of interest from the list,

    Returns critical parameters of relevance
    """
    # TODO: get a complete list of the relevant molecules and associated
    # critical pressure/temperature and accentric factors Currenrly for testing
    with column:
        chosen_molecule = st.selectbox(
            'Choose a molecule of interest',
            ('Custom', 'Water', 'Ethanol'))

        st.write('If using custom values')
        cr_temp = st.number_input(f'T{get_sub("c")}')
        cr_pres = st.number_input(f'P{get_sub("c")}')
        accen_fac = st.number_input('ω')

        if chosen_molecule == 'Custom':
            return cr_temp, cr_pres, accen_fac

        return chosen_molecule, 1, 1


def conditions(column):
    """
    Allow the user to choose a temperature/pressure

    Returns that temperature/pressure
    """
    with column:
        st.write('Define a state of interest')
        temp = st.number_input('Temperature')
        pres = st.number_input('Pressure')

        return temp, pres


def roots(column, roots=['']):
    """
    Displays the roots of the cubic EOS, corresponding to volume
    """
    with column:
        st.write('Roots to the cubic EOS')
        for root in roots:
            st.write(f'v = {root} m{get_sup("3")} mol{get_sup("-1")}')


def departure_fxn(column, depart_vals, depart_units, depart_disp):
    """
    Prints results for departure functions for internal energy, enthalpy,
    entropy, and fugacity (last is technicaly not a departure function
    but is related)
    """
    with column:
        for key, value in depart_vals.items():
            st.write(f'{depart_disp[key]} = {value} {depart_units[key]}')


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


def main():
    depart_units, depart_base, depart_disp = base_vals()

    st.title("Aakash's Website for Solving Cubic Equations of State")
    left_column, right_column = st.columns(2)

    chosen_eos = equation_of_state(left_column)
    cr_temp, cr_pres, accen_fac = molecule(right_column)
    temp, pres = conditions(left_column)

    left_column.button('Calculate!')

    # Temporary setup to render accurately for now, need to add functionality
    # later
    roots(right_column)
    departure_fxn(left_column, depart_base, depart_units, depart_disp)


if __name__ == '__main__':
    main()
