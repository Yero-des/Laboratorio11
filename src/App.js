import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      series: [],
      pos: null,
      titulo: 'Nuevo',
      id: 0,
      nombre: '',
      fecha: '',
      rating: '0',
      categoria: '',
    })

    this.cambioNombre = this.cambioNombre.bind(this);
    this.cambioFecha = this.cambioFecha.bind(this);
    this.cambioRating = this.cambioRating.bind(this);
    this.cambioCategoria = this.cambioCategoria.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);

  }

  componentWillMount() {
    axios.get('http://localhost:8000/api/series/')
    .then(res => {
      this.setState({ series: res.data });
    })
  }

  cambioNombre(e) {
    this.setState(
      { nombre: e.target.value }
    );
  }

  cambioFecha(e) {
    this.setState(
      { fecha: e.target.value }
    );
  }

  cambioCategoria(e) {
    this.setState(
      { categoria: e.target.value }
    );
  }

  cambioRating(e) {
    this.setState(
      { rating: e.target.value }
    );
  }

  mostrar(cod, index) {
    axios.get(`http://localhost:8000/api/series/${cod}`)
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        nombre: res.data.name,
        fecha: res.data.release_date,
        rating: res.data.rating,
        categoria: res.data.category,
      });
    });
  }

  guardar(e) {
    e.preventDefault();
    let cod = this.state.id;
    let datos = {
      id: this.state.id,
      name: this.state.nombre,
      release_date: this.state.fecha,
      rating: this.state.rating,
      category: this.state.categoria,
    }
    if(cod > 0) { // Editamos un registro
      axios.put('http://localhost:8000/api/series/'+ cod +'/', datos)
      .then(res => {
        let indx = this.state.pos;
        this.state.series[indx] = res.data;
        var temp = this.state.series;
        this.setState({
          pos: null,
          titulo: 'Nuevo',
          id: 0,
          nombre: '',
          fecha: '',
          rating: '0',
          categoria: '',
          series: temp,
        });
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);        
      });
    } else { // Nuevo registro
      axios.post('http://localhost:8000/api/series/', datos)
      .then(res => {
        this.state.series.push(res.data);
        var temp = this.state.series;
        this.setState({
          id: 0,
          nombre: '',
          fecha: '',
          rating: '0',
          categoria: '',
          series: temp,
        })
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);        
      });
    }
  }

  eliminar(cod) {
    let rpta = window.confirm("Desea eliminar el registro?");
    if (rpta) {
      axios.delete(`http://localhost:8000/api/series/${cod}`)
      .then(res => {
        var temp = this.state.series.filter((serie) => serie.id!== cod);
        this.setState({
          series: temp,
        });
      });
    }
  }

  mostrarTabla() {
    return (
      <div className='text-center'>
        <h1>Lista de series</h1>
        <div className='row justify-content-center'>
          <div className='col-auto'>
            <table className='table table-striped' border="1">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Rating</th>                    
                <th>Categoria</th>                    
                <th>Acciones</th>                    
              </tr>
            </thead>
            <tbody>  
              {this.state.series.map( (serie, index) => {
                return (
                  <tr key={serie.id}>
                    <td>{serie.name}</td>
                    <td>{serie.release_date}</td>
                    <td>{serie.rating}</td>
                    <td>{serie.category}</td>
                    <td>
                      <button className='btn btn-secondary' onClick={()=>this.mostrar(serie.id,index)}>Editar</button>
                      <button className='btn btn-danger' onClick={()=>this.eliminar(serie.id)}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>        
        </div>
        
        <h1>{this.state.titulo}</h1>
        
        <form className='container' onSubmit={this.guardar}>
          <input type='hidden' value={this.state.id}/>
          <div className='row justify-content-center mb-3'>
            <div className='col-auto'>
              Ingrese nombre:
            </div>
            <div className='col-auto'>
              <input className='form-control' type='text' value={this.state.nombre} onChange={this.cambioNombre}/>
            </div>
          </div>
          <div className='row justify-content-center mb-3'>
            <div className='col-auto'>
              Ingrese rating:
            </div>
            <div className='col-auto'>
              <input className='form-control' type='number' value={this.state.rating} onChange={this.cambioRating}/>
            </div>
          </div>
          <div className='row justify-content-center mb-3'>
            <div className='col-auto'>
              Categoria:
            </div>
            <div className='col-auto'>
              <input className='form-control' type='text' value={this.state.categoria} onChange={this.cambioCategoria}/>
            </div>
          </div>
          <div className='row justify-content-center mb-3'>
            <div className='col-auto'>
              Fecha:
            </div>
            <div className='col-auto'>
              <input className='form-control' type='text' value={this.state.fecha} onChange={this.cambioFecha}/>
            </div>
          </div>
          <p><input type='submit' className='btn btn-success'></input></p>
        </form>
      </div>
    );
  }

  render() {
    return this.mostrarTabla()
  }

}
export default App;
